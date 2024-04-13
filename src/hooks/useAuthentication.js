import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// hooks
import { useFirestore } from "./useFirestore";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [uss, setUss] = useState("");

  const {
    setDocument,
    getDocId,
    getDocWhere,
    error: dataError,
  } = useFirestore();

  useEffect(() => {
    if (dataError) setError(dataError);
  }, [dataError]);

  //cleanup
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfCancelled() {
    if (cancelled) return;
  }

  // currentUser
  const current_user = async () => {
    checkIfCancelled();

    setLoading(true);
    setError(null);

    try {
      let cur_user;

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          cur_user = await getDocWhere("congregacao", {
            attr: "uid",
            comp: "==",
            value: user.uid,
          });

          // console.log("1º", user.uid);
          // console.log("2º", cur_user);

          setUss(cur_user);
        }
      });
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage;

      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

      // console.log(systemErrorMessage);

      setError(systemErrorMessage);
    }

    setLoading(false);
    return uss;
  };

  // register
  const createUser = async (data) => {
    checkIfCancelled();

    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // console.log("1º", user);

      if (data.name !== "adm" && data.name !== "ADM" && data.name !== "Adm")
        await updateProfile(user, { displayName: data.name });

      const admUser = await getDocId("adm_now", "9B04i7SLYIpMV9hINolI");

      // console.log("2º", admUser);

      const dataCurrent = await getDocWhere("congregacao", {
        attr: "uid",
        comp: "==",
        value: admUser.uid,
      });

      // console.log("3º", dataCurrent);

      const congregacao = {
        uid: user.uid,
        nome: user.displayName,
        email: user.email,
        codigoAcesso: data.codigoAcesso,
        responsaveis: data.responsaveis,
      };

      await setDocument("congregacao", congregacao);

      setTimeout(() => {
        logout();
        login({
          email: admUser.email,
          password: "!AlgoPraSaber",
          accessConde: dataCurrent.codigoAcesso,
        });
      }, 300);

      setLoading(false);
      
      // console.log("4º", "Suma");

      const loadingScreen = document.getElementById("loading-screen");
      loadingScreen.classList.add("d-none");
      loadingScreen.classList.remove("loading");

      return user;
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      let systemErrorMessage;

      if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
      }

      setError(systemErrorMessage);
      setLoading(false);
    }
  };

  // logout
  const logout = () => {
    checkIfCancelled();
    signOut(auth);
  };

  // login
  const login = async (data) => {
    checkIfCancelled();

    setLoading(true);
    setError(null);

    try {
      let where = { attr: "codigoAcesso", comp: "==", value: data.accessConde };

      const id = await getDocWhere("congregacao", where, true);

      let systemErrorMessage;

      if (!id) {
        console.log("Perfil não encontrado");
        systemErrorMessage = "Dados incorretos";
        setError(systemErrorMessage);
        setLoading(false);

        return;
      }

      await signInWithEmailAndPassword(auth, data.email, data.password);
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage;

      if (error.message.includes("wrong-password")) {
        systemErrorMessage = "Senha incorreta.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
      }

      console.log(systemErrorMessage);

      setError(systemErrorMessage);
    }
    setLoading(false);
  };

  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    auth,
    createUser,
    current_user,
    loading,
    error,
    logout,
    login,
  };
};

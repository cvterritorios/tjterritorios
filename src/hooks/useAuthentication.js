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
import { useSessionStorage } from "./useSessionStorage";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const {
    getDocId,
    getDocWhere,
    setDocument,
    error: dataError,
  } = useFirestore();

  const { setUserInSession, getUser, isAdmin } = useSessionStorage();

  useEffect(() => {
    if (dataError) setError(dataError);
  }, [dataError]);

  //cleanup
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfCancelled() {
    if (cancelled) return;
  }

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

      // console.log("1º", data);

      await updateProfile(user, { displayName: data.name });

      const userData = getUser();

      const userSession = {
        email: userData.email,
        password: isAdmin() ? userData.code : "!AlgoPraSaber",
        accessCode: isAdmin() ? null : userData.code,
        adm: isAdmin() ? true : null,
      };

      if (!data.adm) {
        const congreg = {
          uid: user.uid,
          name: data.name,
          email: data.email,
          accessCode: data.accessConde,
          responsible: data.responsible,
        };

        await setDocument("congregacoes", congreg);
      }

      setTimeout(() => {
        logout();
        login(userSession);
      }, 300);

      setLoading(false);

      // console.log("4º", "Suma");

      //const loadingScreen = document.getElementById("loading-screen");
      //loadingScreen.classList.add("d-none");
      //loadingScreen.classList.remove("loading");

      return user;
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      let systemErrorMessage;

      if (error.message.includes("email-already")) {
        systemErrorMessage = "E-mail já cadastrado.";
      } else {
        systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
        console.log("Ocorreu um erro, por favor tenta mais tarde.");
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
      if (data.adm) {
        // alert("Log ADM");
        setUserInSession({
          type: "ADM",
          email: data.email,
          code: data.password,
        });

        await signInWithEmailAndPassword(auth, data.email, data.password);

        setLoading(false);
        return;
      }

      let where = { attr: "accessCode", comp: "==", value: data.accessCode };

      const id = await getDocWhere("congregacoes", where, true);

      let systemErrorMessage;

      if (!id) {
        console.log("Perfil não encontrado");
        systemErrorMessage = "Dados incorretos";
        setError(systemErrorMessage);
        setLoading(false);

        return;
      }

      setUserInSession({
        type: "Congregacao",
        email: data.email,
        code: data.accessCode,
      });

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
    loading,
    error,
    logout,
    login,
  };
};

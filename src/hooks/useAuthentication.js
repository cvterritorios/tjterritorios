import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

// hooks
import { useFirestore } from "./useFirestore";
import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [c_User, setC_User] = useState(null);

  const { getDocWhere, error: dataError } = useFirestore();

  useEffect(() => {
    if (dataError) setError(dataError);
    currentUser();
  }, [dataError]);

  //cleanup
  const [cancelled, setCancelled] = useState(false);

  const auth = getAuth();

  function checkIfCancelled() {
    if (cancelled) return;
  }

  // current User
  const currentUser = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setC_User({
          email: user.email,
          uid: user.uid,
          name: user.displayName,
        });
      }
    });
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

      await updateProfile(user, { displayName: data.congregacaoName });
      const dataCurrent = await getDocWhere("congregacao", {
        attr: "uid",
        comp: "==",
        value: c_User.uid,
      });

      logout();
      setTimeout(() => {
        login({
          email: c_User.email,
          password: "!AlgoPraSaber",
          accessConde: dataCurrent.codigoAcesso,
        });
      }, [300]);

      setLoading(false);
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
    currentUser,
    createUser,
    loading,
    error,
    logout,
    login,
  };
};

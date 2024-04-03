import { db } from "../services/firebase";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { useState, useEffect } from "react";

export const useAuthentication = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

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

      await updateProfile(user, { displayName: data.congregacaoName });

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
      const q = query(
        collection(db, "congregacao"),
        where("codigoAcesso", "==", data.accessConde)
      );

      const querySnapshot = await getDocs(q);
      let id;

      querySnapshot.forEach((doc) => {
        id = doc.id;
      });
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

  // congregacoes
  const getCongregacoes = async () => {
    checkIfCancelled();

    setLoading(true);
    setError(null);

    try {
      const q = query(
        collection(db, "congregacao") /* , where("capital", "==", true) */
      );

      let response = [];
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        setLoading(false);
        response.push({ ...doc.data(), id: doc.id });
      });
      return response;
    } catch (error) {
      console.log(error.message);
      console.log(typeof error.message);

      let systemErrorMessage;

      systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";

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
    getCongregacoes,
  };
};

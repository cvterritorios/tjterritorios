
import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { useSessionStorage } from "../hooks/useSessionStorage";
import { MyAlert } from "../components/Alert/Alert";
import { useFirestore } from "../hooks/useFirestore";
import { useLoading } from "./LoadingContext";

const AuthContext = createContext({
  currentUser: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isAuth: false,
  setIsAuth: () => {},
  isAdmin: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { startLoading, stopLoading } = useLoading();
  const {
    isAdmin: isAdminFromSession,
    setUserInSession,
    removeUserInSession,
  } = useSessionStorage();
  const {
    getDocId,
    getDocWhere,
    updateDocument,
    setDocument,
    error: dataError,
  } = useFirestore();

  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!isAdminFromSession());
  const [userSession, setUserSession] = useState(null);

  const login = async ({ email, password, accessCode, adm }) => {
    startLoading();
    try {
      if (adm) {
        setUserInSession({ type: "ADM", email, code: password });
        await signInWithEmailAndPassword(auth, email, password);
        return;
      }

      const where = { attr: "accessCode", comp: "==", value: accessCode };
      const id = await getDocWhere({
        collect: "congregacoes",
        whr: where,
        id: true,
      });

      if (!id) {
        MyAlert({ variant: "danger", text: "Dados incorretos" });
        stopLoading();
        return;
      }

      setUserInSession({ type: "Congregacao", email, code: accessCode });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const systemErrorMessage = error.message.includes("wrong-password")
        ? "Senha incorreta."
        : "Ocorreu um erro, por favor tenta mais tarde.";
      MyAlert({ variant: "danger", text: systemErrorMessage });
    } finally {
      stopLoading();
    }
  };

  const signup = async ({
    email,
    password,
    name,
    accessCode,
    responsible,
    adm = false,
  }) => {
    startLoading();
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(user, { displayName: name });

      const newUserSession = {
        email: user.email,
        password: isAdminFromSession() ? accessCode : "!AlgoPraSaber",
        accessCode: isAdminFromSession() ? null : accessCode,
        adm: isAdminFromSession() ? true : null,
      };

      setUserSession(newUserSession);

      if (adm) {
        const adminsList = await getDocId("admins", "admins");
        const newList = [
          ...adminsList.list,
          { displayName: name, uid: user.uid },
        ];
        await updateDocument("admins", "admins", { list: newList });
      } else {
        const congregacao = {
          uid: user.uid,
          name,
          email,
          accessCode,
          responsible,
        };
        await setDocument("congregacoes", congregacao);
      }
    } catch (error) {
      const systemErrorMessage = error.message.includes("email-already-in-use")
        ? "E-mail já cadastrado."
        : "Ocorreu um erro, por favor tenta mais tarde.";
      MyAlert({ variant: "danger", text: systemErrorMessage });
    } finally {
      logout();
      login(userSession);
      stopLoading();
    }
  };

  const logout = async () => {
    startLoading();
    try {
      removeUserInSession();
      setIsAuth(false);
      setCurrentUser(null);
      await signOut(auth);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuth(true);
        setIsAdmin(!!isAdminFromSession());
      } else {
        setCurrentUser(null);
        setIsAuth(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth, isAdminFromSession]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    isAuth,
    setIsAuth,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
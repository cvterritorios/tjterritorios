import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { MyAlert } from "../components/Alert/Alert";
import { useFirestore } from "../hooks/useFirestore";
import { useLoading } from "./LoadingContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext({
  currentUser: null,
  responsible: null,
  congregation: null,
  login: async ({ email, password }) => {},
  signup: async ({ email, password, username }) => {},
  logout: async () => {},
  isAuth: false,
  isAdmin: false,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const {
    isAdmin: isAdminFromSession,
    removeUserInSession,
    getUser: getUserFromLocalStorage,
  } = useLocalStorage();
  const { getDocId } = useFirestore();

  const [currentUser, setCurrentUser] = useState(null);
  const [responsible, setResponsible] = useState(null);
  const [congregation, setCongregation] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isAdmin, setIsAdmin] = useState(!!isAdminFromSession());

  const login = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { ok: true };
    } catch (error) {
      return { ok: false, message: error.message };
    }
  };

  async function signup({ email, password, username }) {
    try {
      // Criar o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Atualizar o perfil do usuário com o nome de usuário
      await updateProfile(user, { displayName: username });

      console.log("Usuário registrado com sucesso:", user);
      return { ok: true, user: user };
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return { ok: false, message: error.message };
    }
  }

  const logout = async () => {
    try {
      removeUserInSession();
      setIsAuth(false);
      setCurrentUser(null);
      await signOut(auth);
    } catch (error) {
      console.error("Erro ao deslogar usuário:", error);
    }
  };

  async function getCongregationData(usr) {
    const cong = await getDocId("congregacoes", usr.uid);
    setCongregation({ ...cong, displayName: usr.displayName });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuth(true);
        const isAdminUser = isAdminFromSession();
        setIsAdmin(isAdminUser);
        if (!isAdminUser) {
          if (!congregation) getCongregationData(user);

          const userFromLocalStorage = getUserFromLocalStorage();

          if (userFromLocalStorage) {
            setResponsible(userFromLocalStorage.responsible);
          }
        }
      } else {
        setCurrentUser(null);
        setIsAuth(false);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const value = {
    currentUser,
    responsible,
    login,
    signup,
    logout,
    congregation,
    isAuth,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

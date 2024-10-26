import { useState, useEffect } from "react";

// Hook customizado para manipular dados na localStorage
export const useLocalStorage = () => {
  const [cancelled, setCancelled] = useState(false); // Estado para verificar cancelamentos

  // Função para verificar se o hook foi cancelado
  function checkIfCancelled() {
    if (cancelled) return;
  }

  // Define dados do usuário na localStorage
  const setUserInSession = (
    data = { type: "", email: "", code: "", responsible: false }
  ) => {
    try {
      localStorage.setItem("userType", data.type);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userCode", data.code);
      data.responsible && localStorage.setItem("responsible", data.responsible);
      return true;
    } catch (error) {
      console.log(error.message); 
      return false;
    }
  };

  const setThemeInStorage = (theme) => {
    try {
      localStorage.setItem("theme", theme);
      return true;
    } catch (error) {
      console.log(error.message); 
      return false;
    }
  };

  const getThemeFromStorage = () => {
    return localStorage.getItem("theme");
  };

  // Remove dados do usuário da localStorage
  const removeUserInSession = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userCode");
    localStorage.removeItem("responsible");
    return true;
  };

  // Verifica se o usuário na sessão é admin
  const isAdmin = () => {
    const userType = localStorage.getItem("userType");
    return userType && userType.includes("ADM");
  };

  // Obtém os dados do usuário da localStorage
  const getUser = () => {
    const data = {
      type: localStorage.getItem("userType"),
      email: localStorage.getItem("userEmail"),
      code: localStorage.getItem("userCode"),
      responsible: localStorage.getItem("responsible"),
    };
    return data.type == null ? null : data;
  };

  // Cleanup quando o componente for desmontado
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    setUserInSession,
    setThemeInStorage,
    getThemeFromStorage,
    removeUserInSession,
    isAdmin,
    getUser,
  };
};

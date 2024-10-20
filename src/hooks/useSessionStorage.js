import { useState, useEffect } from "react";

// Hook customizado para manipular dados na sessionStorage
export const useSessionStorage = () => {
  const [cancelled, setCancelled] = useState(false); // Estado para verificar cancelamentos

  // Função para verificar se o hook foi cancelado
  function checkIfCancelled() {
    if (cancelled) return;
  }

  // Define dados do usuário na sessionStorage
  const setUserInSession = (data = { type: "", email: "", code: "" }) => {
    try {
      sessionStorage.setItem("userType", data.type);
      sessionStorage.setItem("userEmail", data.email);
      sessionStorage.setItem("userCode", data.code);
      return true;
    } catch (error) {
      console.log(error.message); // Corrigido de 'messeger' para 'message'
      return false;
    }
  };

  // Remove dados do usuário da sessionStorage
  const removeUserInSession = () => {
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userCode");
    return true;
  };

  // Verifica se o usuário na sessão é admin
  const isAdmin = () => {
    const userType = sessionStorage.getItem("userType");
    return userType && userType.includes("ADM");
  };

  // Obtém os dados do usuário da sessionStorage
  const getUser = () => {
    const data = {
      type: sessionStorage.getItem("userType"),
      email: sessionStorage.getItem("userEmail"),
      code: sessionStorage.getItem("userCode"),
    };
    return data.type == null ? null : data;
  };

  // Cleanup quando o componente for desmontado
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    setUserInSession,
    removeUserInSession,
    isAdmin,
    getUser,
  };
};

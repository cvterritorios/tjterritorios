import { useState, useEffect } from "react";

export const useSessionStorage = () => {
  const [loading, setLoading] = useState(null);

  //cleanup
  const [cancelled, setCancelled] = useState(false);

  function checkIfCancelled() {
    if (cancelled) return;
  }

  // functions - sets
  const setUserInSession = (data = { type: "", email: "", code: "" }) => {
    try {
      sessionStorage.setItem("userType", [data.type]);
      sessionStorage.setItem("userEmail", [data.email]);
      sessionStorage.setItem("userCode", [data.code]);

      return true;
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      //   systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
    }
  };

  const isAdmin = () => {
    return sessionStorage.getItem("userType").includes("ADM");
  };

  // functions - gets
  const getUser = () => {
    try {
      const data = {
        type: sessionStorage.getItem("userType"),
        email: sessionStorage.getItem("userEmail"),
        code: sessionStorage.getItem("userCode"),
      };

      return data;
    } catch (error) {
      console.log(error.messeger);
      console.log(typeof error.messeger);

      //   systemErrorMessage = "Ocorreu um erro, por favor tenta mais tarde.";
    }
  };

  // useEffect
  useEffect(() => {
    return () => setCancelled(true);
  }, []);

  return {
    loading,
    //sets
    setUserInSession,
    //functions
    isAdmin,
    getUser,
  };
};

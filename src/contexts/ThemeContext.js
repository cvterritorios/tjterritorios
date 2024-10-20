import React, { createContext, useContext, useEffect, useState } from "react";

// Criação do contexto
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  backColor: "",
  backSubColor: "",
  backForm: "",
  navbar: "",
  textColor: "",
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [backColor, setBackColor] = useState("");
  const [navbar, setNavbar] = useState("");
  const [backSubColor, setBackSubColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backForm, setBackForm] = useState("");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const fillMode = (mode) => {
    if (mode === "dark") {
      setBackColor("bg-gray-800 ");
      setBackSubColor("bg-gray-500 ");
      setNavbar("navbar-dark bg-gray-600 ");
      setTextColor("text-slate-300");
      setBackForm("bg-gray-300 focus:bg-gray-300/60 ");
    } else if (mode === "light") {
      setBackColor("bg-bg-gray-200 ");
      setBackSubColor("bg-gray-300/20 ");
      setNavbar("navbar-light bg-gray-300 ");
      setTextColor("text-slate-900");
      setBackForm("bg-white ");
    }
  };

  useEffect(() => {
    fillMode(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        navbar,
        backColor,
        backSubColor,
        textColor,
        backForm,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

// Criação do contexto
const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => {},
  backColor: "",
  backSubColor: "",
  backForm: "",
  cardColor: "",
  navbar: "",
  navbarText: "",
  navbarHover: "",
  textColor: "",
  backTextView: "",
});

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const { getThemeFromStorage, setThemeInStorage } = useLocalStorage();

  const htmlTag = document.querySelector("html");

  htmlTag.setAttribute("data-bs-theme", getThemeFromStorage() || "light");

  const [theme, setTheme] = useState(getThemeFromStorage() || "light");
  const [backColor, setBackColor] = useState("");
  const [navbar, setNavbar] = useState("");
  const [navbarText, setNavbarText] = useState("");
  const [navbarHover, setNavbarHover] = useState("");
  const [backSubColor, setBackSubColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backForm, setBackForm] = useState("");
  const [cardColor, setCardColor] = useState("");
  const [backTextView, setBackTextView] = useState("");

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      setThemeInStorage("dark");
      htmlTag.setAttribute("data-bs-theme", "dark");
    } else {
      setTheme("light");
      setThemeInStorage("light");
      htmlTag.setAttribute("data-bs-theme", "light");
    }
  };

  const fillMode = (mode) => {
    if (mode === "dark") {
      // Background
      setBackColor("bg-gray-800 ");
      setBackSubColor("bg-gray-500 ");
      //Navbar
      setNavbar("navbar-dark bg-gray-700 ");
      setNavbarText("text-gray-300");
      setNavbarHover("hover:text-slate-400");
      // Text
      setTextColor("text-slate-100 hover:text-slate-500");
      // Form
      setBackForm("bg-gray-300 focus:bg-gray-300/60 ");
      // Card
      setCardColor("bg-gray-700");
      setBackTextView("bg-gray-700");
    } else if (mode === "light") {
      // Background
      setBackColor("bg-bg-gray-200 ");
      setBackSubColor("bg-gray-300/20 ");
      // Navbar
      setNavbar("navbar-light bg-gray-300 ");
      setNavbarText("text-gray-900");
      setNavbarHover("hover:text-slate-700");
      // Text
      setTextColor("text-gray-900 hover:text-gray-700");
      // Form
      setBackForm("bg-white ");
      // Card
      setCardColor("bg-gray-100");
      setBackTextView("bg-gray-100");
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
        navbarText,
        navbarHover,
        backColor,
        backSubColor,
        textColor,
        backForm,
        cardColor,
        backTextView,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

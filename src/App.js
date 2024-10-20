import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// hooks
import { useState, useEffect } from "react";
import { useFirestore } from "./hooks/useFirestore";

// context
import { useAuth } from "./contexts/AuthContext";
import { useTheme } from "./contexts/ThemeContext";

// components
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Congregacoes from "./pages/Congregacoes/Congregacoes";
import { useSessionStorage } from "./hooks/useSessionStorage";

const App = () => {
  const { isAuth, isAdmin, logout } = useAuth();
  const { getUser } = useSessionStorage();
  const { backColor, textColor } = useTheme();

  useEffect(() => {
    console.log(isAdmin, isAuth);
  }, [getUser(), isAuth]);

  return (
    <>
      <BrowserRouter>
        <div className={backColor + "m-0 p-0 h-screen"}>
          <NavBar />
          <div className={textColor}>
            <Routes className="">
              <Route path="/about" element={<About />} />
              <Route
                path="/"
                element={isAuth ? <Home /> : <Navigate to="/login" />}
              />

              <Route
                path="/login"
                element={!isAuth ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/register"
                element={
                  isAuth ? (
                    isAdmin ? (
                      <Register />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/congregacoes"
                element={
                  isAuth ? (
                    isAdmin ? (
                      <Congregacoes />
                    ) : (
                      <Navigate to="/" />
                    )
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
            {/* <Footer /> */}
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;

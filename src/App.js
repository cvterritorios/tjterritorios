import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Spinner } from "react-bootstrap";

// hooks
import { useState, useEffect } from "react";
import { useAuthentication } from "./hooks/useAuthentication";
import { useSessionStorage } from "./hooks/useSessionStorage";

// context
import { AuthProvider } from "./contexts/AuthContext";

// components
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";

// pages
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Congregacoes from "./pages/Congregacoes/Congregacoes";
import { useFirestore } from "./hooks/useFirestore";

const App = () => {
  const [user, setUser] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(true);

  const { auth } = useAuthentication();

  const { getCollection } = useFirestore();
  const loadingUser = user === undefined;

  const isAdminNow = async () => {
    const adminList = await getCollection("admins").then((res) => {
      return res[0].list;
    });

    checkAdmInList(adminList);

    function checkAdmInList(list) {
      list.forEach((adm) => {
        if (adm == user?.displayName) setIsAdmin(true);
      });
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      setUser(user);
      // console.log(user.displayName);
      await isAdminNow();
    });
  }, [auth]);

  if (loadingUser) {
    return <p>Carregando...</p>;
  }

  return (
    <>
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <div className="bg-gray m-0 p-0 h-auto">
            <NavBar />
            <div className="contentor">
              <Routes>
                <Route
                  path="/"
                  element={user ? <Home /> : <Navigate to="/login" />}
                />
                <Route path="/about" element={<About />} />
                <Route
                  path="/login"
                  element={!user ? <Login /> : <Navigate to="/" />}
                />
                <Route
                  path="/register"
                  element={
                    user ? (
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
                    user ? (
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
            </div>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
};

export default App;

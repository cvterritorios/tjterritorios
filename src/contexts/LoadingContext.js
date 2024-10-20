import React, { createContext, useContext, useState } from "react";
import loadingImage from "../assets/gifs/loading.gif";
// import loadingImageDark from "../assets/gifs/loading.gif";

// Criação do contexto de loading
const LoadingContext = createContext();

export const useLoading = () => {
  return useContext(LoadingContext);
};

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Funções para controlar o estado de loading
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  const showLoadingImage = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#e1dfdb] hover:cursor-wait z-50">
        <img
          aria-disabled
          src={loadingImage} // Insira a URL da sua imagem
          alt="Loading..."
          className="w-72 h-72 object-contain " // Ajuste o tamanho conforme necessário
        />
      </div>
    );
  };

  return (
    <LoadingContext.Provider value={{ loading, startLoading, stopLoading }}>
      {!loading && children}
      {loading && showLoadingImage()}
    </LoadingContext.Provider>
  );
};

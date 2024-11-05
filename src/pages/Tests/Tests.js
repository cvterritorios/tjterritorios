import React, { useState } from "react";
import {
  NorthTopIcon,
  NorthRightIcon,
  NorthLeftIcon,
} from "../../components/Icons/MyIcons";

const Tests = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <ImageToBase64Converter imageUrl="https://firebasestorage.googleapis.com/v0/b/tjterritorios.appspot.com/o/territorios%2F3IRuoAeQeCDNmsFExgoY%2Fmapa.png?alt=media&token=27c2d479-8928-42e8-8c06-c19fe74cafbf" />
    </div>
  );
};

const ImageToBase64Converter = ({ imageUrl }) => {
  const [base64Url, setBase64Url] = useState("");

  const convertImageToBase64 = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        setBase64Url(reader.result); // O resultado será uma URL de Base64
      };

      reader.readAsDataURL(blob);
    } catch (error) {
      console.error("Erro ao converter a imagem para Base64:", error);
    }
  };

  return (
    <div>
      <button onClick={() => convertImageToBase64(imageUrl)}>
        Converter Imagem para Base64
      </button>
      {base64Url && (
        <div>
          <h3>URL em Base64:</h3>
          <textarea rows="10" cols="50" readOnly value={base64Url} />
        </div>
      )}
    </div>
  );
};

export default Tests;

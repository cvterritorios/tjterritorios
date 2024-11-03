import { QRCodeCanvas } from "qrcode.react";
import { Container } from "react-bootstrap";
import CryptoJS from "crypto-js"; // Importa o CryptoJS para criptografia
import { useState, useEffect } from "react";

const GenerateQRCode = ({ content, size = 256, setUrl, isLink = false }) => {
  const secretkey = "tjterritorios2024";

  useEffect(() => {
    if (!content) return;

    const timeout = setTimeout(() => {
      downloadQRCode();
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const downloadQRCode = () => {
    if (!content) return;

    const tempCanvas = document.createElement("canvas");
    const qrCanvas = document.querySelector("canvas");
    const ctx = tempCanvas.getContext("2d");

    const borderWidth = 1;
    tempCanvas.width = qrCanvas.width + borderWidth * 2;
    tempCanvas.height = qrCanvas.height + borderWidth * 2;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(qrCanvas, borderWidth, borderWidth);

    const pngUrl = tempCanvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    setUrl(pngUrl);
  };

  if (!content) return null;

  return (
    <Container className="flex justify-center items-center relative hidden">
      <div className="bg-white p-1">
        <QRCodeCanvas
          value={isLink ? content : encryptQRCodeContent(content, secretkey)} // Valor a ser codificado no QR code
          size={size} // Tamanho do QR code em pixels
          bgColor="#ffffff" // Cor de fundo do QR code (branco)
          fgColor="#000000" // Cor das áreas marcadas do QR code (preto)
          level={"H"} // Nível de correção de erros (H é o mais alto)
          includeMargin={false} // Inclui margem ao redor do QR code
        />
      </div>
    </Container>
  );
};

export const encryptQRCodeContent = (content, secretkey) => {
  const conteudoJson = JSON.stringify(content);

  const conteudoCriptografado = CryptoJS.AES.encrypt(
    conteudoJson,
    secretkey
  ).toString();

  return conteudoCriptografado;
};

export const decryptQRCodeContent = (content, secretkey) => {
  // Opcional: Descriptografa o conteúdo para verificar
  const conteudoDescriptografado = CryptoJS.AES.decrypt(
    content,
    secretkey
  ).toString(CryptoJS.enc.Utf8);

  return conteudoDescriptografado;
};

// Exporta o componente GenerateQRCode como padrão para que possa ser importado em outros arquivos
export default GenerateQRCode;

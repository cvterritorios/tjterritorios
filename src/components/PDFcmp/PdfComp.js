import React, { useState } from "react";
import TerritoryPdf from "../TerritoryPdf";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import mapa from "../../assets/images/imagemTrt.png";
import GenerateQRCode from "../../containers/QReader/generateQRCode";
import { Button, Modal } from "react-bootstrap";

const PdfComp = ({territory}) => {
  const [qrTerritoryURL, setQRTerritoryURL] = useState(null);
  const [qrMapURL, setQRMapURL] = useState(null);
  const [qrCodesGenerated, setQRCodesGenerated] = useState(0);

  const [showModal, setShowModal] = useState(false);

  // Função para controlar a sequência de geração dos QR codes
  const handleQRGenerated = (url, type) => {
    if (type === "left") {
      setQRTerritoryURL(url);
      setQRCodesGenerated((prev) => prev + 1);
    } else if (type === "map") {
      setQRMapURL(url);
      setQRCodesGenerated((prev) => prev + 1);
    }
  };

  // Componente do PDF para reutilização
  const PdfDocument = () => (
    <TerritoryPdf
      mapImage={mapa}
      qrTerritory={qrTerritoryURL}
      qrCodeMap={qrMapURL}
      territoryNumber="04"
      location="Covilhã"
      northPosition="top"
      streets={[
        "Santo António",
        "São João",
        "São Pedro",
        "São Sebastião",
        "São Vicente",
      ]}
      references={["Jardim da Serra", "Pelourinho", "São João"]}
    />
  );

  const myModal = () => (
    <Modal
      size="xl"
      centered
      className="min-h-72"
      show={showModal}
      onHide={() => setShowModal(false)}
    >
      <Modal.Header>
        <Modal.Title>
          <h1>Territorio 04 - Covilhã</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="h-96">
        <PDFViewer width="100%" height="100%" showToolbar={false}>
          <PdfDocument />
        </PDFViewer>
      </Modal.Body>
    </Modal>
  );


  return (
    <div className="flex justify-center items-center">
      {qrCodesGenerated < 2 && (
        <>
          {!qrTerritoryURL && (
            <GenerateQRCode
              content={{ name: "qrCodeLeft" }}
              setUrl={(url) => handleQRGenerated(url, "left")}
            />
          )}
          {!qrMapURL && qrTerritoryURL && (
            <GenerateQRCode
              content="https://www.google.com"
              setUrl={(url) => handleQRGenerated(url, "map")}
              isLink={true}
            />
          )}
        </>
      )}

      {/* {qrTerritoryURL && <img src={qrTerritoryURL} alt="QR Code Left" width={200} height={200} />} */}
      {/* {qrMapURL && <img src={qrMapURL} alt="QR Code Right" width={200} height={200} />} */}

      {qrCodesGenerated === 2 && (
        <div className="flex space-x-2">
          <PDFDownloadLink
            document={<PdfDocument />}
            fileName="territorio-04-covilha.pdf"
          >
            {({ loading }) => (
              <Button
                size="sm"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                title="Baixar o PDF"
                disabled={loading}
              >
                {"Baixar PDF"}
              </Button>
            )}
          </PDFDownloadLink>
          <Button
            size="sm"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowModal(true)}
          >
            Visualizar PDF
          </Button>
          <Button
            size="sm"
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded"
            title="Enviar os codigos qr para o publicador"
          >
            Enviar
          </Button>
        </div>
      )}
      {myModal()}
    </div>
  );
};

export default PdfComp;

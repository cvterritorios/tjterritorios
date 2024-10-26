import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Container, Modal } from "react-bootstrap";

const QReader = ({close}) => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: 250,
      fps: 10,
      aspectRatio: 1.0,
    });

    scanner.render(success);

    function success(result) {
      scanner.clear();
      setScanResult(result);
    }
  }, []);

  setTimeout(() => {
    let btn = document.getElementById("html5-qrcode-button-camera-permission");
    if (btn) btn.click();
  }, 1000);

  return (
    <>
      <Container>
        {scanResult ? (
          <div>
            Success: <a href={scanResult}>{scanResult}</a>
          </div>
        ) : (
          <>
            <Modal.Body>
              <div id="reader"></div>
            </Modal.Body>
          </>
        )}
      </Container>
    </>
  );
};

export default QReader;

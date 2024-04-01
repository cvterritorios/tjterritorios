import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

const QReader = () => {
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: 250,
      fps: 10,
      aspectRatio: 1.0
    });

    scanner.render(success, error);

    function success(result) {
      scanner.clear();
      setScanResult(result);
    }

    function error(err) {
      //      console.warn(err);
    }
  }, []);

  return (
    <>
      <h1>QR Code</h1>
      <Container>
        {scanResult ? (
          <div>
            Success: <a href={scanResult}>{scanResult}</a>
          </div>
        ) : (
          <div id="reader"></div>
        )}
      </Container>
    </>
  );
};

export default QReader;

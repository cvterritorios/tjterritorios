import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { pinIcon, squareIcon } from "./shared";
import northTop from "../assets/images/north/top.png";
import northRight from "../assets/images/north/right.png";
import northLeft from "../assets/images/north/left.png";
import { storage } from "../services/firebase";
import { ref, getDownloadURL } from "firebase/storage";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
});

const TerritoryPdf = ({
  mapImage,
  qrTerritory,
  qrCodeMap,
  territoryDescription,
  location,
  northPosition,
  streets = [],
  references = [],
}) => {
  const descriptionSplit = territoryDescription.split(" ");
  const territoryNumber = descriptionSplit[descriptionSplit.length - 1];

  return (
    <Document title={`${territoryDescription} - ${location}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Lado Esquerdo - Frente */}
        <View
          style={{
            width: "46.46%",
            height: "45.24%",
            borderRight: "1px solid #000",
            borderBottom: "1px solid #000",
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              height: "10%",
              width: "100%",
            }}
          >
            {/* Navegação */}
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "8px",
                justifyContent: "center",
              }}
            >
              {northPosition === "left" && (
                <Image
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                  src={northLeft}
                />
              )}
              {northPosition === "right" && (
                <Image
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                  src={northRight}
                />
              )}
              {northPosition === "top" && (
                <Image
                  style={{
                    width: "15px",
                    height: "15px",
                  }}
                  src={northTop}
                />
              )}
            </View>
            {/* Título */}
            <Text style={{ fontSize: 14 }}>Mapa de Território</Text>
            {/* Número do Território */}
            <Text style={{ fontSize: 10, marginRight: "8px" }}>
              nº {territoryNumber}
            </Text>
          </View>

          <Image
            style={{
              width: "100%",
              height: "78%",
              objectFit: "contain",
            }}
            src={"data:image/jpeg;base64,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"}
          />

          {/* Ruas e Referências */}
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#fff",
              height: "12%",
              width: "100%",
              padding: "4px 30px",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                gap: "2px",
              }}
            >
              {/* Ruas */}
              {streets.map((street, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: "6px",
                    minWidth: "50px",
                  }}
                >
                  <Image
                    style={{
                      width: "10px",
                      height: "10px",
                      marginRight: "4px",
                    }}
                    src={squareIcon(index + 1)}
                  />
                  <Text style={{ fontSize: 10 }}>{street}</Text>
                </View>
              ))}
              {/* Referências */}
              {references.map((reference, index) => (
                <View
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginHorizontal: "6px",
                    minWidth: "50px",
                  }}
                >
                  <Image
                    style={{
                      width: "10px",
                      height: "10px",
                      marginRight: "4px",
                    }}
                    src={pinIcon(index + 1)}
                  />
                  <Text style={{ fontSize: 10 }}>{reference}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Lado Direito - Verso */}
        <View
          style={{
            width: "46.46%",
            height: "45.24%",
            borderLeft: "1px solid #000",
            borderBottom: "1px solid #000",
          }}
        >
          {/* Topo */}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              height: "10%",
              width: "100%",
              borderBottom: "1px solid #000",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                marginLeft: "14px",
                marginTop: "8px",
              }}
            >
              Localidade: {location}
            </Text>
          </View>

          {/* Conteúdo */}
          <View
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: "73%",
                height: "100%",
                borderRight: "1px dotted #000",
              }}
            >
              <Text style={{ fontSize: 8, margin: "8px 14px" }}>
                Trabalhe apenas na área assinalada no mapa. Tome cuidado para
                não o manchar, marcar ou dobrar. Cada vez que o território for
                coberto, por favor informe o irmão que cuida do arquivo dos
                territórios.
              </Text>

              <View
                style={{
                  width: "100%",
                  height: "22.48%",
                }}
              >
                {/* Espaço em branco */}
              </View>

              <View
                style={{
                  width: "100%",
                  height: "77.52%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                {/* QR Code do Mapa */}
                <View
                  style={{
                    width: "50%",
                    height: "100%",
                    padding: "0px 16px",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 8 }}>
                    Escaneie o código abaixo para visualizar o mapa
                    digitalmente.
                  </Text>
                  <Image
                    style={{
                      width: "110px",
                      height: "110px",
                      marginTop: "4px",
                    }}
                    src={qrCodeMap}
                  />
                </View>
                <View style={{ width: "50%", height: "100%" }}>
                  {/* Espaço em branco */}
                </View>
              </View>
            </View>

            {/* Área reservada para o servo dos territórios */}
            <View
              style={{
                width: "27%",
                height: "100%",
                borderLeft: "1px dotted #000",
                textAlign: "center",
              }}
            >
              <Text style={{ fontSize: 8, margin: "8px 14px" }}>
                Área reservada para o servo dos territórios
              </Text>

              <View
                style={{
                  fontSize: 8,
                  margin: "8px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>Recebido em:</Text>
                <View
                  style={{
                    marginTop: "10px",
                    borderRadius: "50%",
                    border: "2px dotted #000",
                    height: "30px",
                    width: "85%",
                  }}
                ></View>
              </View>

              <View
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "10px",
                }}
              >
                <Image
                  style={{ width: "80px", height: "80px" }}
                  src={qrTerritory}
                />
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TerritoryPdf;

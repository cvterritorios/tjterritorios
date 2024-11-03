import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import { pinIcon, squareIcon } from "./shared";
import northIconArrow from "../assets/images/northIcon-arrow.png";
import northIconN from "../assets/images/northIcon-n.png";

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
  territoryNumber,
  location,
  northPosition,
  streets = [],
  references = [],
}) => {
  return (
    <Document title={`Territorio ${territoryNumber} - ${location}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Lado Esquerdo - Frente */}
        <View
          style={{
            width: "46.46%",
            height: "45.24%",
            backgroundColor: "#feeaa3",
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
              <Image style={{ width: "8px", height: "8px" }} src={northIconN} />
              <Image
                style={{
                  width: "10px",
                  height: "10px",
                  transform: `rotate(${
                    northPosition == "left"
                      ? 270
                      : northPosition == "right"
                      ? -270
                      : 0
                  }deg)`,
                }}
                src={northIconArrow}
              />
            </View>
            {/* Título */}
            <Text style={{ fontSize: 14 }}>Mapa de Território</Text>
            {/* Número do Território */}
            <Text style={{ fontSize: 10, marginRight: "8px" }}>
              nº {territoryNumber}
            </Text>
          </View>

          <Image style={{}} src={mapImage} />

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

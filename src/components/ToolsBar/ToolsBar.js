import { useState, useEffect } from "react";
import {
  Form,
  Button,
  ButtonGroup,
  DropdownButton,
  Dropdown,
  Container,
} from "react-bootstrap";
import {
  MdAddCircleOutline,
  MdOutlineViewDay,
  MdOutlineViewArray,
} from "react-icons/md";
import {
  FaArrowDownShortWide,
  FaArrowDownWideShort,
  FaDeleteLeft,
} from "react-icons/fa6";

// hooks
import { useFirestore } from "../../hooks/useFirestore";

import Bandeja from "../../containers/Bandeja/Bandeja";

// contexts
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

const ToolsBar = ({ create }) => {
  const [collectionSearch, setCollectionSearch] = useState([]);

  const [searchTxt, setSearchTxt] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const [isTagSearching, setIsTagSearching] = useState(false);

  const [viewMode, setViewMode] = useState(false);
  const [isFilterUn, setIsFilterUn] = useState(false);
  const [isFilterAv, setIsFilterAv] = useState(false);

  // lista de territorios
  const [listaTerritorios, setListaTerritorios] = useState([]);

  const [orderDescription, setOrderDescription] = useState(false);
  const [orderDate, setOrderDate] = useState(false);
  const [orderRequests, setOrderRequests] = useState(false);
  const [orderAsc, setOrderAsc] = useState(true);

  const [congregacoesOptions, setCongregacoesOptions] = useState("");
  const [congregacaoSelected, setCongregacaoSelected] = useState("");

  const { isAdmin, currentUser: user, isAuth } = useAuth();

  const { theme } = useTheme();

  const {
    getCollection,
    getDocWhere,
    getTerritories,
    error: errorData,
    loading: loadingData,
  } = useFirestore();

  const makeCongregacoesOptions = async () => {
    if (!isAdmin) return;

    const myList = await getCollection("congregacoes");

    const options = myList?.map((congregacao) => {
      return (
        <option key={congregacao.email} value={congregacao.id}>
          {congregacao.name}
        </option>
      );
    });

    setCongregacoesOptions(options);
    // console.log(myCon);
  };

  const handleClearButton = () => {
    handleFilter("all");
    setSearchTxt("");
    setOrderDate(false);
    setOrderRequests(false);
    setOrderDescription(false);
    setIsSearching(false);
    setCollectionSearch([]);
  };

  const clearFilterButton = () => {
    if (
      isFilterAv ||
      isFilterUn ||
      searchTxt ||
      orderDate ||
      orderRequests ||
      orderDescription
    ) {
      return (
        <Button
          variant="danger"
          className="border-0"
          onClick={() => handleClearButton()}
        >
          <FaDeleteLeft size={20} title="Resetar filtros" />
        </Button>
      );
    }
  };

  useEffect(() => {
    if (isAuth && isAdmin) makeCongregacoesOptions();
    if (isAuth && !isAdmin) setCongregacaoSelected(user.uid);

    async function getTer() {
      const imgs = [
        "https://firebasestorage.googleapis.com/v0/b/tjterritorios.appspot.com/o/territorios%2F0eLvKAxYvJJcETV3mVEu%2Fmapa.png?alt=media&token=55b00322-aa8d-4834-bf40-43f33fe0d863",
        "https://firebasestorage.googleapis.com/v0/b/tjterritorios.appspot.com/o/territorios%2FGgN2zBOUDkhVS3cF38cY%2Fmapa.png?alt=media&token=fbccc926-396b-41c6-a894-7cb4dfe9647c",
      ];
      const references = [
        "G Sao Joao",
        "Pelourinho",
        "G Santo Antonio",
        "G Sao Francisco",
      ];

      const lista = Array.from(
        { length: 5 + Math.floor(Math.random() * 6) },
        () => ({
          requests: {
            current: Math.floor(Math.random() * 10),
            all: Math.floor(Math.random() * 100),
          },
          createdAt: new Date(
            Date.now() - Math.floor(Math.random() * 7776000000)
          ),
          description: "Território N " + Math.floor(Math.random() * 100),
          available: Math.random() < 0.5,
          map: imgs[Math.floor(Math.random() * imgs.length)],
          observation:
            Math.random() < 0.5
              ? ""
              : `Observação aleatória ${Math.floor(Math.random() * 100)}`,
          references: Array.from(
            { length: Math.floor(Math.random() * 3) + 1 },
            () => references[Math.floor(Math.random() * references.length)]
          ),
        })
      );

      /* await getTerritories({
        congregacaoId: user.uid,
        isAdmin: isAdmin,
      });
 */
      setListaTerritorios(lista);
    }

    listaTerritorios.length < 1 && getTer();

    return () => {};
  }, [isAuth, listaTerritorios]);

  const searchAdv = (text, tag = false) => {
    if (!text) {
      setIsSearching(false);
      return setCollectionSearch([]);
    }

    if (tag) {
      setIsSearching(true);
      const resultado = listaTerritorios.filter((item) =>
        item.references.includes(text)
      );
      setCollectionSearch(resultado);
    } else {
      setIsSearching(true);
      const resultado = listaTerritorios.filter((item) =>
        item.description.toLowerCase().includes(text.toLowerCase())
      );
      setCollectionSearch(resultado);
    }

  };

  const handleFilter = (type, value) => {
    if (type === "all") {
      setIsFilterAv(false);
      setIsFilterUn(false);
      setCollectionSearch([]);
      setIsSearching(false);
    } else if (type === "available") {
      console.log(collectionSearch);

      if (value) {
        setIsFilterAv(true);
        setIsFilterUn(false);

        const available = searchTxt
          ? collectionSearch.filter((item) => item.available === true)
          : listaTerritorios.filter((item) => item.available === true);

        setIsSearching(true);

        setCollectionSearch(available);
      } else {
        setIsFilterAv(false);
        setIsFilterUn(true);

        const unavailable = searchTxt
          ? collectionSearch.filter((item) => item.available === false)
          : listaTerritorios.filter((item) => item.available === false);

        setIsSearching(true);

        setCollectionSearch(unavailable);
      }
    }
  };

  return (
    <>
      <Container className={"my-3 text-center "}>
        <Form.Control
          type="search"
          disabled={!!!congregacaoSelected}
          className={theme === "dark" ? "bg-dark" : "bg-light"}
          placeholder="Pesquisar"
          aria-label="Pesquisar"
          value={searchTxt}
          onChange={(e) => {
            setSearchTxt(e.target.value);
            searchAdv(e.target.value);
          }}
        />

        <ButtonGroup
          aria-label="toolsbar"
          className={`my-3 h-10 md:w-auto w-full border-2 ${theme === "dark" ? "border-slate-700" : "border-slate-300"}`}
        >
          <Button
            disabled
            variant={theme === "light" ? "light" : "dark"}
            className={`border-0 `}
          ></Button>

          {!isAdmin && (
            <Button
              title="Adicionar Território"
              variant={theme === "light" ? "light" : "dark"}
              className={`border-0 flex items-center justify-center`}
              onClick={create}
            >
              <MdAddCircleOutline size={24} />
            </Button>
          )}

          {isAdmin && (
            <Form.Select
              variant={theme === "light" ? "light" : "dark"}
              className="border-0"
              size="sm"
              onChange={(e) => {
                setCongregacaoSelected(e.target.value);
              }}
            >
              <option value="">Seleciona uma congregação</option>
              {congregacoesOptions}
            </Form.Select>
          )}

          <DropdownButton
            variant={theme === "light" ? "light" : "dark"}
            as={ButtonGroup}
            title="Filtrar"
            className={`border-0`}
          >
            <Dropdown.Item
              eventKey="1"
              onClick={() => {
                handleFilter("all");
              }}
            >
              Todos
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              active={isFilterAv}
              onClick={() => {
                handleFilter("available", true);
              }}
            >
              Disponivel
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              active={isFilterUn}
              onClick={() => {
                handleFilter("available", false);
              }}
            >
              Indisponivel
            </Dropdown.Item>
          </DropdownButton>

          <DropdownButton
            variant={theme === "light" ? "light" : "dark"}
            as={ButtonGroup}
            title={
              orderDate
                ? "Por Data"
                : orderRequests
                ? "Por Pedidos"
                : orderDescription
                ? "Descrição"
                : "Ordenar"
            }
            className="border-0"
          >
            <Dropdown.Item
              eventKey="1"
              active={orderDescription}
              onClick={() => {
                setOrderDescription(true);
                setOrderDate(false);
                setOrderRequests(false);
              }}
            >
              Descrição
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              active={orderDate}
              onClick={() => {
                setOrderDescription(false);
                setOrderDate(true);
                setOrderRequests(false);
              }}
            >
              Data de inclusão
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              active={orderRequests}
              onClick={() => {
                setOrderDescription(false);
                setOrderDate(false);
                setOrderRequests(true);
              }}
            >
              Mais pedidos
            </Dropdown.Item>
          </DropdownButton>

          {orderDate || orderRequests || orderDescription ? (
            <Button
              variant={theme === "light" ? "light" : "dark"}
              className="border-0"
              onClick={(e) => {
                setOrderAsc(!orderAsc);
              }}
            >
              {!orderAsc && <FaArrowDownWideShort />}
              {orderAsc && <FaArrowDownShortWide />}
            </Button>
          ) : (
            ""
          )}

          <Button
            variant={theme === "light" ? "light" : "dark"}
            className="border-0 flex items-center justify-center"
          >
            {viewMode && (
              <MdOutlineViewDay
                size={25}
                className="border-0 "
                title="Vista em lista"
                onClick={() => {
                  setViewMode(false);
                }}
              />
            )}
            {!viewMode && (
              <MdOutlineViewArray
                size={25}
                className="border-0 "
                title="Vista em grade"
                onClick={() => {
                  setViewMode(true);
                }}
              />
            )}
          </Button>

          <Button
            variant={theme === "light" ? "light" : "dark"}
            disabled
            className="border-0"
          ></Button>

          {clearFilterButton()}
        </ButtonGroup>
      </Container>

      <Bandeja
        territoryCollection={isSearching ? collectionSearch : listaTerritorios}
        viewGrid={viewMode}
        filter={[isFilterAv, isFilterUn]}
        searching={searchTxt}
        setTag={setSearchTxt}
        setSearchFunction={searchAdv}
        isOrdered={
          orderDate
            ? "createdAt"
            : orderRequests
            ? "requests"
            : orderDescription
            ? "description"
            : null
        }
        orderDir={orderAsc ? "asc" : "desc"}
        congregacaoId={congregacaoSelected}
      />
    </>
  );
};

export default ToolsBar;

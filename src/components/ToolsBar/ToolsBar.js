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
import { FaArrowDownShortWide, FaArrowDownWideShort } from "react-icons/fa6";

// hooks
import { useSessionStorage } from "../../hooks/useSessionStorage";
import { useFirestore } from "../../hooks/useFirestore";

import Bandeja from "../../containers/Bandeja/Bandeja";
import { useAuth } from "../../contexts/AuthContext";

const ToolsBar = ({ create, setError, setLoading }) => {
  const [collectionSearch, setCollectionSearch] = useState([]);

  const [searchTxt, setSearchTxt] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [isFilterUn, setIsFilterUn] = useState(false);
  const [isFilterAv, setIsFilterAv] = useState(false);

  // lista de territorios
  const [listaTerritorios, setListaTerritorios] = useState([]);

  const [orderDescription, setOrderDescription] = useState(true);
  const [orderDate, setOrderDate] = useState(false);
  const [orderRequests, setOrderRequests] = useState(false);
  const [orderAsc, setOrderAsc] = useState(true);

  const [congregacoesOptions, setCongregacoesOptions] = useState("");
  const [congregacaoSelected, setCongregacaoSelected] = useState("");

  const { isAdmin, currentUser: user, isAuth } = useAuth();
  const {
    getCollection,
    getDocWhere,
    error: errorData,
    loading: loadingData,
  } = useFirestore();

  const makeCongregacoesOptions = async () => {
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

  const getCongregationIdNow = async () => {
    const myCongregation = await getDocWhere({
      collect: "congregacoes",
      whr: {
        attr: "email",
        comp: "==",
        value: user.email,
      },
    });

    console.log(myCongregation);
    // setCongregacaoSelected(myCongregation.id);
  };

  const handleClearButton = () => {
    setIsFilterAv(false);
    setIsFilterUn(false);
    setSearchTxt("");
    setOrderDate(false);
    setOrderRequests(false);
  };

  const clearFilterButton = () => {
    if (isFilterAv || isFilterUn || searchTxt || orderDate || orderRequests) {
      return (
        <Button
          variant="danger"
          className="border-0 mx-3"
          onClick={() => handleClearButton()}
        >
          Limpar
        </Button>
      );
    }
  };

  useEffect(() => {
    isAuth && isAdmin && makeCongregacoesOptions();
    isAuth && !isAdmin && getCongregationIdNow();
  }, [isAuth]);

  const searchAdv = (text) => {
    console.log(text);
    console.log(listaTerritorios);
    if (!text) return listaTerritorios; // Se o texto for vazio, retorna a lista completa
    const resultado = listaTerritorios.filter(
      (item) => item.description.toLowerCase().includes(text.toLowerCase()) // Ignora maiúsculas e minúsculas
    );
    setCollectionSearch(resultado);
  };

  return (
    <>
      <Container className="my-3 text-center">
        <Form.Control
          type="search"
          disabled={!congregacaoSelected}
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
          className="my-3 h-10 md:w-auto w-full border-2"
        >
          <Button className="border-0 bg-gray-50 hover:bg-gray-50 active:bg-gray-50"></Button>

          {!isAdmin && (
            <Button
              variant="light"
              title="Adicionar Território"
              className="border-0"
              onClick={create}
            >
              <MdAddCircleOutline size={24} />
            </Button>
          )}

          {isAdmin && (
            <Form.Select
              className="border-0 bg-gray-50"
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
            variant="light"
            as={ButtonGroup}
            title="Filtrar"
            className="border-0"
            id="dropdown-basic-button"
          >
            <Dropdown.Item
              eventKey="1"
              onClick={() => {
                setIsFilterAv(false);
                setIsFilterUn(false);
              }}
            >
              Todos
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              active={isFilterAv}
              onClick={() => {
                setIsFilterAv(true);
                setIsFilterUn(false);
              }}
            >
              Disponivel
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              active={isFilterUn}
              onClick={() => {
                setIsFilterUn(true);
                setIsFilterAv(false);
              }}
            >
              Indisponivel
            </Dropdown.Item>
          </DropdownButton>

          <DropdownButton
            variant={orderDate || orderRequests ? "info" : "light"}
            as={ButtonGroup}
            title={"Ordenar"}
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
              variant="light"
              className="border-0 text-black"
              onClick={(e) => {
                setOrderAsc(!orderAsc);
              }}
            >
              {orderAsc && <FaArrowDownWideShort />}
              {!orderAsc && <FaArrowDownShortWide />}
            </Button>
          ) : (
            ""
          )}

          <ButtonGroup className="items-center">
            <MdOutlineViewDay
              size={30}
              className="text-light py-2 h-10 text-black border-0 bg-gray-50 hover:bg-gray-300"
              title="Vista em lista"
              onClick={() => {
                setViewMode(false);
              }}
            />
            /
            <Form.Check
              type="switch"
              className="hidden "
              checked={viewMode}
              onChange={() => {
                viewMode ? setViewMode(false) : setViewMode(true);
              }}
            />
            <MdOutlineViewArray
              size={30}
              className="text-light py-2 h-10 text-black border-0 bg-gray-50 hover:bg-gray-300"
              title="Vista em grade"
              onClick={() => {
                setViewMode(true);
              }}
            />
          </ButtonGroup>

          <Button className="border-0 bg-gray-50 hover:bg-gray-50"></Button>
        </ButtonGroup>

        {clearFilterButton()}
      </Container>

      {/* <Bandeja
        collectionSearch={collectionSearch}
        viewGrid={viewMode}
        filter={[isFilterAv, isFilterUn]}
        searching={searchTxt}
        setTag={setSearchTxt}
        isOrdered={
          orderDate ? "createdAt" : orderRequests ? "requests" : "description"
        }
        orderDir={orderAsc ? "asc" : "desc"}
        congregacaoId={congregacaoSelected}
        setListaTerritorios={setListaTerritorios}
      />  */}
    </>
  );
};

export default ToolsBar;

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
import { useFirestore } from "../../hooks/useFirestore";
import Bandeja from "../../containers/Bandeja/Bandeja";

const ToolsBar = (action) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [isFilterUn, setIsFilterAn] = useState(false);
  const [isFilterAv, setIsFilterAv] = useState(false);

  const [orderDescription, setOrderDescription] = useState(false);
  const [orderDate, setOrderDate] = useState(false);
  const [orderRequests, setOrderRequests] = useState(false);
  const [orderAsc, setOrderAsc] = useState(false);

  return (
    <>
      <Container className="my-3 text-center">
        <Form.Control
          type="search"
          placeholder="Pesquisar"
          aria-label="Pesquisar"
          value={searchTxt}
          onChange={(e) => {
            setSearchTxt(e.target.value);
          }}
        />

        <ButtonGroup
          aria-label="toolsbar"
          className="my-3 h-10 md:w-auto w-full border-2"
        >
          <Button className="border-0 bg-gray-50 hover:bg-gray-50"></Button>

          <Button
            variant="light"
            title="Adicionar Território"
            className="border-0"
            onClick={action.create}
          >
            <MdAddCircleOutline size={24} />
          </Button>

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
                setIsFilterAn(false);
              }}
            >
              Todos
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="2"
              active={isFilterAv}
              onClick={() => {
                setIsFilterAv(true);
                setIsFilterAn(false);
              }}
            >
              Disponivel
            </Dropdown.Item>
            <Dropdown.Item
              eventKey="3"
              active={isFilterUn}
              onClick={() => {
                setIsFilterAn(true);
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

          {orderDate || orderRequests ? (
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
              className="py-2 border-0 bg-gray-50 hidden hover:bg-gray-300"
              defaultChecked={viewMode}
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
      </Container>

      <Bandeja
        viewGrid={viewMode}
        filter={[isFilterAv, isFilterUn]}
        searching={searchTxt}
        setTag={setSearchTxt}
        isOrdered={orderDate ? "createdAt" : orderRequests ? "requests" : false}
        orderDir={orderAsc ? "asc" : "desc"}
      />
    </>
  );
};

export default ToolsBar;

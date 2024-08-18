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
  MdOutlineFilterList,
  MdOutlineSelectAll,
  MdGridView,
  MdFormatListBulleted,
} from "react-icons/md";

// hooks
import { useFirestore } from "../../hooks/useFirestore";
import Bandeja from "../../containers/Bandeja/Bandeja";

const ToolsBar = (action) => {
  const [searchTxt, setSearchTxt] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const [isFilterUn, setIsFilterAn] = useState(false);
  const [isFilterAv, setIsFilterAv] = useState(false);

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

        <ButtonGroup aria-label="toolsbar" className="my-3 h-10">
          <Button className="border-0 bg-gray-500 hover:bg-gray-500"></Button>

          <Button
            variant="secondary"
            title="Adicionar Território"
            className="border-0"
            onClick={action.create}
          >
            <MdAddCircleOutline size={24} />
          </Button>

          <DropdownButton
            variant="secondary"
            as={ButtonGroup}
            title={<MdOutlineFilterList />}
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

          <Button
            variant="secondary"
            title="Selecionar"
            style={{ border: "none" }}
          >
            <MdOutlineSelectAll />
          </Button>

          <ButtonGroup>
            <MdFormatListBulleted
              size={38}
              className="text-light py-2 h-10 border-0 bg-gray-500 hover:bg-gray-600/90"
              title="Vista em lista"
              onClick={() => {
                setViewMode(false);
              }}
            />

            <Form.Check
              type="switch"
              className="py-2 border-0 bg-gray-500 hover:bg-gray-500"
              defaultChecked={viewMode}
              checked={viewMode}
              onChange={() => {
                viewMode ? setViewMode(false) : setViewMode(true);
              }}
            />

            <MdGridView
              size={38}
              className="text-light py-2 h-10 border-0 bg-gray-500 hover:bg-gray-600/90"
              title="Vista em grade"
              onClick={() => {
                setViewMode(true);
              }}
            />
          </ButtonGroup>

          <Button className="border-0 bg-gray-500 hover:bg-gray-500"></Button>
        </ButtonGroup>
      </Container>

      <Bandeja
        viewGrid={viewMode}
        filter={[isFilterAv, isFilterUn]}
        searching={searchTxt}
        setTag={setSearchTxt}
      />
    </>
  );
};

export default ToolsBar;

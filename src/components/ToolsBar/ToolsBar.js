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
  const [collection, setCollection] = useState([{}]);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    getCollection,
    error: dataError,
    loading: dataLoading,
  } = useFirestore();

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(searchTxt);
  };

  useEffect(() => {
    if (dataError) setError(dataError);
    if (dataLoading) setLoading(dataLoading);
    if (viewMode) {
      console.log("Grid");
    }
  }, [dataError, dataLoading, viewMode]);

  return (
    <>
      <Container className="mt-3 text-center">
        <Form className="d-flex" onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Pesquisar"
            aria-label="Pesquisar"
            onChange={(e) => {
              setSearchTxt(e.target.value);
            }}
          />
        </Form>

        <ButtonGroup aria-label="toolsbar" className="m-3">
          <Button
            style={{ backgroundColor: "rgb(110, 117, 122)", border: "none" }}
            className="tools-disabled-button"
          ></Button>
          <Button
            variant="secondary"
            title="Adicionar Território"
            onClick={action.create}
            style={{ border: "none" }}
          >
            <MdAddCircleOutline />
          </Button>

          <DropdownButton
            variant="secondary"
            as={ButtonGroup}
            style={{ border: "none", boxDecorationBreak: false }}
            title={<MdOutlineFilterList />}
            id="bg-nested-dropdown"
          >
            <Dropdown.Item eventKey="1">Filtrar 1</Dropdown.Item>
            <Dropdown.Item eventKey="2">Filtrar 3</Dropdown.Item>
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
              className="text-light p-2"
              style={{ backgroundColor: "rgb(110, 117, 122)", border: "none" }}
              title="Vista em lista"
            />
            <Form.Check
              type="switch"
              className="pt-2 text-success"
              defaultChecked={viewMode}
              style={{ backgroundColor: "rgb(110, 117, 122)", border: "none" }}
              onChange={() => {
                viewMode ? setViewMode(false) : setViewMode(true);
              }}
            />
            <MdGridView
              size={38}
              className="text-light p-2"
              style={{ backgroundColor: "rgb(110, 117, 122)", border: "none" }}
              title="Vista em grade"
            />
            <Button
              style={{ backgroundColor: "rgb(110, 117, 122)", border: "none" }}
              className="tools-disabled-button"
            ></Button>
          </ButtonGroup>
        </ButtonGroup>
      </Container>
    </>
  );
};

export default ToolsBar;

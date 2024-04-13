import { useState } from "react";
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

const ToolsBar = () => {
  const [searchTxt, setSearchTxt] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    console.log(searchTxt);
  };

  return (
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

      <ButtonGroup aria-label="toolsbar" className="w-25 m-3">
        <Button variant="secondary" title="Adicionar Território">
          <MdAddCircleOutline />
        </Button>

        <DropdownButton
          variant="secondary"
          as={ButtonGroup}
          title={<MdOutlineFilterList />}
          id="bg-nested-dropdown"
        >
          <Dropdown.Item eventKey="1">Filtrar 1</Dropdown.Item>
          <Dropdown.Item eventKey="2">Filtrar 3</Dropdown.Item>
        </DropdownButton>

        <Button variant="secondary" title="Selecionar">
          <MdOutlineSelectAll />
        </Button>

        <ButtonGroup>
          <Button variant="secondary" title="Vista em grade">
            <MdGridView />
          </Button>
          <Button variant="secondary" title="Vista em lista">
            <MdFormatListBulleted />
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Container>
  );
};

export default ToolsBar;

import {
  Button,
  Navbar,
  Nav,
  Form,
} from "react-bootstrap";

function Barra() {
  return (
    <>
      <Navbar bg="light" expand="lg">
  <Navbar.Brand href="#home">Volaos</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="mr-auto">
      <Nav.Link href="/">Inicio</Nav.Link>
    </Nav>
    <Form inline>
      <Button variant="outline-success" href="/login">Login</Button>
    </Form>
  </Navbar.Collapse>
</Navbar>
<img id='imagenhugo0'/>
    </>
  );
}
export default Barra;

import {Navbar, Container, Nav} from 'react-bootstrap'

function Header(props){


  return(
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand href="/">Brain Cell Data Viewer</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="genex">GeneExp</Nav.Link>
            <Nav.Link href="regag">RegionAgg</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;

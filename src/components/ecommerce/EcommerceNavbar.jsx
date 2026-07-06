import { Nav, Navbar, Container } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

function EcommerceNavbar({ cartCount }) {
  return (
    <Navbar expand="lg" className="ff-navbar" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/ecommerce" className="ff-brand">
          <span className="ff-brand-mark" aria-hidden="true">F</span>
          <span>FairwayFit <em>Golf</em></span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="fairwayfit-navigation" aria-label="Toggle store navigation" />
        <Navbar.Collapse id="fairwayfit-navigation">
          <Nav className="ms-auto align-items-lg-center">
            <Nav.Link as={NavLink} to="/ecommerce/products">Shop</Nav.Link>
            <Nav.Link as={NavLink} to="/ecommerce/survey">Survey</Nav.Link>
            <Nav.Link as={NavLink} to="/ecommerce/cart" className="ff-cart-link">
              Cart <span className="ff-cart-count" aria-label={`${cartCount} items in cart`}>{cartCount}</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/" className="ff-back-link">← Portfolio</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default EcommerceNavbar;

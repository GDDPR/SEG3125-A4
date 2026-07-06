import { Button, Container, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function NavigationBar({ darkMode, toggleDarkMode }) {
    const navigate = useNavigate();

    function goToSection(sectionId) {
        navigate('/', { state: { scrollTo: sectionId } });
    }

    return (
        <Navbar
            expand="lg"
            bg={darkMode ? 'dark' : 'white'}
            variant={darkMode ? 'dark' : 'light'}
            fixed="top"
            className="shadow-sm"
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    My Portfolio
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />

                <Navbar.Collapse id="main-navbar">
                    <Nav className="ms-auto align-items-lg-center">
                        <Nav.Link as="button" type="button" onClick={() => goToSection('work')}>How I Work</Nav.Link>
                        <Nav.Link as="button" type="button" onClick={() => goToSection('projects')}>Case Studies</Nav.Link>

                        <Button
                            variant={darkMode ? 'outline-light' : 'outline-dark'}
                            size="sm"
                            className="ms-lg-3 mt-2 mt-lg-0"
                            onClick={toggleDarkMode}
                        >
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </Button>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;

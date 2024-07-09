import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { useLogoutUserMutation } from "../services/appApi";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/R.png";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
function Navigation() {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);

    navigate("/");
  }

  return (
    <Navbar
      bg="light bg-opacity-25"
      expand="lg"
      className="justify-content-center fs-4 text-center"
    >
      <Navbar.Toggle aria-controls="basic-navbar-nav" className="bg-white" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mx-auto">
          {!user && (
            <LinkContainer to="/login">
              <Nav.Link className="text-white">
                <i class="fa-solid fa-right-to-bracket fa-beat mx-2"></i>Login
              </Nav.Link>
            </LinkContainer>
          )}
          <LinkContainer to="/">
            <Nav.Link className="text-white">
              <i className="fa-sharp fa-solid fa-house-user fa-beat mx-2"></i>
              Home
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/chat">
            <Nav.Link className="text-white">
              <i className="fa-brands fa-rocketchat fa-beat mx-2"></i>Chat
            </Nav.Link>
          </LinkContainer>

          <LinkContainer to="/video">
            <Nav.Link className="text-white">
              <i class="fa-solid fa-video fa-beat mx-2"></i>Video
            </Nav.Link>
          </LinkContainer>

          {user && (
            <NavDropdown
              title={
                <>
                  <img
                    src={user.picture}
                    style={{
                      width: 30,
                      height: 30,
                      marginRight: 10,
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                    alt="User Avatar"
                  />
                  <span className="text-white">{user.name}</span>
                </>
              }
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item className="bg-white text-center">
                <Button variant="danger" onClick={handleLogout}>
                  <i class="fa-solid fa-right-from-bracket fa-beat mx-2"></i>Log
                  Out
                </Button>
              </NavDropdown.Item>
            </NavDropdown>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;

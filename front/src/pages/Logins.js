import React, { useEffect, useState } from "react";
import { useLoginUserMutation } from "../services/appApi";
import { Col, Container, Row, Button, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Aos from "aos";
import "aos/dist/aos.css";

function Logins() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);

  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  function handleLogin(e) {
    e.preventDefault();
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        socket.emit("new-user");

        navigate("/chat");
      }
    });
  }
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  return (
    <div className="login" data-aos="fade-down">
      <div className="container">
        <div className="section">
          <Form
            style={{
              maxWidth: 700,
              marginTop: 100,
              width: 700,
              padding: 30,
            }}
            onSubmit={handleLogin}
            className="bg-dark bg-opacity-75 rounded-5"
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {error && <p className="alert alert-danger">{error.data}</p>}
              <h1 className="text-center pb-5">Log Ur Account</h1>
              <Form.Label className="fs-3">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                className="border-secondary"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Form.Text className=" text-white ">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label className="fs-3">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </Button>
            <div className="py-4 d-flex align-items-center justify-content-between">
              <p className="text-center fs-4">Forgot Password</p>
              <button
                className="noselect blue bt"
                style={{ width: 100, fontSize: 20 }}
              >
                <Link to="/forgot" className="text-white text-decoration-none">
                  Reset
                </Link>
              </button>
            </div>
            <div className="py-4 d-flex align-items-center justify-content-between">
              <p className="text-center fs-4">Don't have an account ? </p>
              <button
                className="noselect blue bt"
                style={{ width: 100, fontSize: 20 }}
              >
                <Link to="/signup" className="text-white text-decoration-none">
                  Signup
                </Link>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Logins;

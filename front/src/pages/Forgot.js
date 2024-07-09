import React, { useEffect, useState } from "react";

import { Col, Container, Row, Button, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

import Aos from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Forgot() {
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data === "Success") {
        toast.error("User Not Found");
      } else {
        navigate(data);
      }
    } catch (err) {
      alert(err);
    }
  };
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
            onSubmit={handleSubmit}
            className="bg-dark bg-opacity-75 rounded-5"
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <h1 className="text-center pb-5">Reset Ur Account</h1>
              <Form.Label className="fs-3">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                className="border-secondary"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <button
                type="submit"
                className="noselect blue bt text-center mt-5"
              >
                Send
              </button>
              <ToastContainer />
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Forgot;

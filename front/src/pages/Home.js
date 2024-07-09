import React, { useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./Home.css";
import About from "./monsite/About";
import HomePage from "./monsite/HomePage";
import Services from "./monsite/Services";
import Contact from "./monsite/Contact";
import { useSelector } from "react-redux";
import Aos from "aos";
import "aos/dist/aos.css";

function Home() {
  const user = useSelector((state) => state.user);
  useEffect(() => {
    Aos.init({ duration: 2500 });
  }, []);
  return (
    <div className="Home">
      <HomePage />
      <Row className="home_bg mb-3">
        <Col
          md={6}
          className="d-flex flex-direction-column align-items-center justify-content-center"
          data-aos="fade-left"
        >
          <div className="my-5">
            <h1>Share the world with your friends</h1>
            <p className="fs-4">TalkSquad lets you connect with the world</p>
            <LinkContainer to={!user ? "/login" : "/chat"}>
              <Button className="fs-5 mx-5 z-3" variant="success">
                Get started
                <i className="fas fa-comments home-message-icon"></i>
              </Button>
            </LinkContainer>
            <LinkContainer to={!user ? "/login" : "/video"}>
              <Button className="fs-5 z-3" variant="success">
                Get started
                <i className="fas fa-video home-message-icon"></i>
              </Button>
            </LinkContainer>
          </div>
        </Col>
        <Col
          md={6}
          className="d-flex flex-direction-column align-items-center justify-content-center"
          data-aos="fade-right"
        >
          <div class="text-container my-5">
            <h1 className="fs-1">TalkSquad</h1>
            <br></br>
            <h1 className="fs-3">Let's Build Our Community</h1>
          </div>
        </Col>
      </Row>

      <Services />
      <About />
      <Contact />
    </div>
  );
}

export default Home;

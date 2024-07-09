import React, { useEffect } from "react";
import texting from "./imgs/texting.jpg";
import audio from "./imgs/audio.png";
import video from "./imgs/video.jpg";
import meet from "./imgs/2.jpg";
import classroom from "./imgs/3.jpg";
import community from "./imgs/1.jpg";
import { Col, Row } from "react-bootstrap";
import Aos from "aos";
import "aos/dist/aos.css";

const Services = () => {
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });
  return (
    <section className="services py-5 mx-3 ">
      <h2 className="text-center mt-5" data-aos="fade-down">
        Our Services
      </h2>
      <p className="fs-5 text-center" data-aos="fade-down">
        We offer to our users many services{" "}
      </p>
      <div className="container">
        <Row className="mb-5" data-aos="fade-right">
          <Col md={4}>
            <div
              className="card bg-secondary text-center text-white mb-2 bg-opacity-25 border-black"
              style={{ maxWidth: "22rem", height: "auto" }}
            >
              <div className="card-header ">
                <img
                  src={texting}
                  style={{ height: 200, width: 200, borderRadius: "15%" }}
                />
              </div>
              <div className="card-title fs-3">Texting</div>
              <div className="card-text fs-5">
                With short messaging, you can quickly send and receive
                text-based information.
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="card  text-center bg-secondary text-white mb-2 bg-opacity-25 border-black"
              style={{ maxWidth: "22rem", height: "auto" }}
            >
              <div className="card-header">
                <img
                  src={audio}
                  style={{ height: 200, width: 200, borderRadius: "15%" }}
                />
              </div>
              <div className="card-title fs-3">Audio Call</div>
              <div className="card-text fs-5">
                you can engage in one-on-one conversations or participate in
                group discussions.
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="card bg-secondary  text-center text-white mb-2 bg-opacity-25 border-black"
              style={{ maxWidth: "22rem", height: "auto" }}
            >
              <div className="card-header">
                <img
                  src={video}
                  style={{ height: 200, width: 200, borderRadius: "15%" }}
                />
              </div>
              <div className="card-title fs-3">Video Call</div>
              <div className="card-text fs-5">
                It enables individuals to engage in face-to-face conversations
                in real-time using audio and video transmission.
              </div>
            </div>
          </Col>
        </Row>

        <Row data-aos="fade-left">
          <Col md={4}>
            <div
              className="card text-center bg-secondary  text-white mb-2 bg-opacity-25 border-black"
              style={{ maxWidth: "22rem", height: "auto" }}
            >
              <div className="card-header ">
                <img
                  src={meet}
                  style={{ height: 200, width: 200, borderRadius: "15%" }}
                />
              </div>
              <div className="card-title fs-3">Online meetings</div>
              <div className="card-text fs-5">
                It enable real-time discussions, presentations, and
                collaborations among participants who may be geographically
                dispersed.
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="card bg-secondary text-center text-white mb-2 bg-opacity-25 border-black"
              style={{ maxWidth: "22rem", height: "auto" }}
            >
              <div className="card-header ">
                <img
                  src={classroom}
                  style={{ height: 200, width: 200, borderRadius: "15%" }}
                />
              </div>
              <div className="card-title fs-3">Classroom</div>
              <div className="card-text fs-5">
                It provides a streamlined and organized environment for teachers
                and students to collaborate, communicate, and manage their
                coursework.{" "}
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div
              className="card bg-secondary text-center text-white mb-2 bg-opacity-25 border-black "
              style={{ maxWidth: "22rem", height: "auto" }}
            >
              <div className="card-header ">
                <img
                  src={community}
                  style={{ height: 200, width: 200, borderRadius: "15%" }}
                />
              </div>
              <div className="card-title fs-3">Create a Community</div>
              <div className="card-text fs-5">
                a space for like-minded individuals to connect, engage in
                discussions, share content, and collaborate on specific topics
                or activities.
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default Services;

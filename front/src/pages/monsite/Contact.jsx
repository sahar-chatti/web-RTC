import React, { Fragment, useEffect, useRef } from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import "../Home.css";
import Aos from "aos";
import "aos/dist/aos.css";

import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
const Contact = () => {
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_4ibivbr",
        "template_05p8dx8",
        form.current,
        "3FSkGMH_VWE5PwKVb"
      )
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Thank's for giving your feedback");
        },
        (error) => {
          console.log(error.text);
          toast.error("Please Try Later");
        }
      );
    e.target.reset();
  };
  return (
    <div className="container">
      <div
        className="mx-auto bg-secondary bg-opacity-25"
        style={{ maxWidth: 950, maxHeight: 1000, borderRadius: "5%" }}
      >
        <MDBRow className="p-5 mx-3">
          <MDBCol md="4">
            <div className="text-center" style={{ marginTop: "50px" }}>
              <MDBIcon
                fas
                icon="fa-sharp fa-regular fa-id-card text-white"
                size="3x"
              />
              <MDBTypography tag="h3" className="text-white">
                Get In Touch
              </MDBTypography>
              <p>
                <i class="fa-brands fa-google"></i>WWW.TALKSQUAD.com
              </p>
              <p>
                <i className="fas fa-mail-bulk"></i>TALKSQUAD@gmail.com
              </p>
            </div>
          </MDBCol>
          <MDBCol md="8" className="justify-content-center">
            <MDBCard className="card-custom border-0  text-white bg-secondary bg-opacity-25 rounded-5 ">
              <MDBCardBody className="mt-0 mx-2">
                <div className="text-center mb-3 mt-3">
                  <MDBTypography tag="h4">Contact Us</MDBTypography>
                </div>

                <form ref={form} className="mb-0 px-10" onSubmit={sendEmail}>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput
                        label="firstname"
                        type="text"
                        name="firstname"
                      />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput label="lastname" type="text" name="lastname" />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput label="city" type="text" name="city" />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput
                        label="shortMessage"
                        type="text"
                        name="shortMessage"
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="mb-4">
                    <MDBCol>
                      <MDBInput label="address" type="text" name="address" />
                    </MDBCol>
                    <MDBCol>
                      <MDBInput label="email" type="text" name="email" />
                    </MDBCol>
                  </MDBRow>

                  <div className="align-items-center text-center">
                    <button className="glow-on-hover bt z-3">Submit</button>
                    <ToastContainer />
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </div>
    </div>
  );
};

export default Contact;

import React, { useEffect, useState } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import profile from "../assets/P.jpg";
import { ToastContainer, toast } from "react-toastify";
import Aos from "aos";
import "aos/dist/aos.css";

function Signup() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  //upload images

  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  function validateImage(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return toast("max file size is 1mb");
    } else {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function uploadImage() {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "piryywx6");
    try {
      setUploadingImg(true);
      let res = await fetch(
        "https://api.cloudinary.com/v1_1/dgkeix0lr/image/upload",
        {
          method: "post",
          body: data,
        }
      );
      const urlData = await res.json();
      setUploadingImg(false);
      return urlData.url;
    } catch (error) {
      setUploadingImg(false);
      console.log(error);
    }
  }
  async function handleSignup(e) {
    e.preventDefault();
    if (!image) return toast("Please Upload your profile picture");
    const url = await uploadImage(image);
    console.log(url);
    signupUser({ name, email, password, picture: url }).then(({ data }) => {
      if (data) {
        console.log(data);
        navigate("/chat");
      }
    });
  }
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });

  return (
    <div className="sign" data-aos="fade-down">
      <div className="container">
        <div className="d-flex align-items-center justify-content-center mt-4 text-white">
          <Form
            style={{
              maxWidth: 700,
              padding: 50,
              width: 700,
            }}
            onSubmit={handleSignup}
            className="bg-dark bg-opacity-75 rounded-5"
          >
            <h1 className="text-center "> Create an account</h1>
            <div className="signup-profile-pic_container">
              <img
                src={imagePreview || profile}
                className="signup-profile-pic"
              ></img>
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png , image/jpeg"
                onChange={validateImage}
              />
            </div>
            {error && <p className="alert alert-danger">{error.data}</p>}
            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label className="fs-3">Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
              <Form.Text className="text-white">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fs-3">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <Form.Text className="text-white">
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
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
              {uploadingImg || isLoading ? "Signing you up..." : "Signup"}
            </Button>
            <ToastContainer />
            <div className="py-4 d-flex align-items-center justify-content-between">
              <p className="text-center fs-3">Don't have an account ? </p>
              <button
                className="noselect blue bt"
                style={{ width: 100, fontSize: 20 }}
              >
                <Link to="/login" className="text-white text-decoration-none ">
                  Login
                </Link>
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Signup;

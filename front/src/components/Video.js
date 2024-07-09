import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import Typed from "react-typed";
import Carousel from "./Carousel";
const textLines = [
  `1) - Get the ID of the Room or link `,
  `2) -Join the Room`,
  `3) -Your Meeting is secure`,
];

const Video = () => {
  const user = useSelector((state) => state.user);

  const [roomID, setRoomID] = useState("");

  useEffect(() => {
    Aos.init({ duration: 2500 });
  });
  return (
    <div className=" d-flex justify-content-around align-content-center">
      <div
        className="mt-4 text-white text-center"
        data-aos="fade-right"
        delay="5"
      >
        <h1>
          Join our vibrant community today and<br></br> unlock a world of
          exciting possibilities to meet.
        </h1>
        <h2>Share the world with your friends</h2>

        <span className="display-5 fs-1 text-primary border-black">
          {" "}
          <Typed
            strings={textLines}
            typeSpeed={60}
            startDelay={300}
            backSpeed={100}
            backDelay={100}
            loop={true}
          />
        </span>
        <Carousel />
      </div>
      <div
        data-aos="zoom-in"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="bg-opacity-25 bg-secondary text-secondary mx-5"
          style={{
            borderRadius: "10%",
            height: 500,
            width: 500,

            textAlign: "center",
          }}
        >
          {user ? (
            <div className="container">
              <h1 className="my-5 text-white ">Create Your Meeting</h1>
              <button className="mb-5 bt">
                {" "}
                <Link to="/videoCall" className="text-decoration-none">
                  Create A TalkMeet
                </Link>
              </button>
              <br />
              <input
                className="mb-5 rounded-5 text-black bg-opacity-25 text-center p-2 "
                type="text"
                placeholder="RoomId"
                onChange={(e) => setRoomID(e.target.value)}
              />
              <p className="mb-5 text-white">if you have ID_Room join it</p>
              <button className="bt">
                <Link
                  className="text-decoration-none fs-5"
                  to={`http://localhost:3000/videoCall?roomID=${roomID}`}
                >
                  Join
                </Link>
              </button>
            </div>
          ) : (
            <>
              <div className=" opacity-75 alert alert-success text-primary">
                Please login{" "}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Video;

import React, { useEffect } from "react";
import Typed from "react-typed";
import Aos from "aos";
import "aos/dist/aos.css";
const textLines = [`is a Community`, `is a Website Meeting`, `is a `];

const HomePage = () => {
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });
  return (
    <section className="home text-center mt-5 pt-5" data-aos="fade-down">
      <div>
        <h2 className="display-4 fw-200">
          Talk Squad
          <span className="display-5 fs-1 text-primary">
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
        </h2>
        <p className="fs-3 py-5">
          Go-to online platform for connecting <br></br> At TalkSquad, we
          believe in the power of human connections. Our user-friendly interface
          and robust features make it effortless <br></br> to browse through
          profiles, initiate conversations, and form genuine connections we
          provides a welcoming and secure environment to connect. <br></br>{" "}
          <br></br> Join our vibrant community today and unlock a world of
          exciting possibilities to meet.
        </p>
      </div>
    </section>
  );
};

export default HomePage;

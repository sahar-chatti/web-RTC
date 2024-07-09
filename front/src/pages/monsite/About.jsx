import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
function About() {
  useEffect(() => {
    Aos.init({ duration: 2500 });
  });
  return (
    <div>
      <section className=" pt-5" data-aos="fade-up">
        <div class="row mx-2 company-info">
          <h2 className="text-center mb-5">About Us</h2>
          <h3>Our Story:</h3>
          <p className="fs-4">
            TalkSquad, developed by students, debuted in 2023 as a user-friendly
            video conferencing and communication platform. With seamless
            integration and a range of features like real-time captions and
            screen sharing, it catered to individuals, businesses, and
            educational institutions, supporting the global transition to remote
            work and distance learning
          </p>
        </div>
        <div class="row mx-2 mission-vision">
          <h3>Our Mission:</h3>
          <p className="fs-4">
            TalkSquad offers high-quality voice and video calling, text chat,
            and messaging features for both casual and professional use. Its
            server management capabilities allow users to create customizable
            communities, promoting collaboration. With multiplatform access,
            integration with various platforms, and a robust developer
            community, It provides a comprehensive and engaging communication
            experience.
          </p>
        </div>
        <div class="row mx-2 team">
          <h3>Our Team:</h3>
          <ul className="fs-4 list-unstyled">
            <li>Sahar CHATTI</li>
            <li>Zied SAGUEM</li>
            <li>Houssem SAADAOUI</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default About;

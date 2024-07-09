import { useRef, useEffect } from "react";
import useMousePosition from "./UseMousePosition";

const MouseFollower = () => {
  const div = useRef(null);
  const mousePosition = useMousePosition();

  useEffect(() => {
    if (div.current) {
      div.current.style.left = mousePosition.x + "px";
      div.current.style.top = mousePosition.y + "px";
    }
  }, [mousePosition]);
  return (
    <div
      className="position-absolute  rounded-circle  bg-danger z-20"
      ref={div}
      style={{ filter: "blur(50px)", height: 250, width: 300 }}
    ></div>
  );
};

export default MouseFollower;

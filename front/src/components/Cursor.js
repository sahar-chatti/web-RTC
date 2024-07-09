import React from "react";
import AnimatedCursor from "react-animated-cursor";
import { ListGroupItem } from "react-bootstrap";

const Cursor = () => {
  return (
    <div className=" z-3">
      <AnimatedCursor
        innerSize={30}
        outerSize={30}
        color="125, 125, 125"
        outerAlpha={0.2}
        innerScale={1}
        outerScale={2.5}
        clickables={[
          "a",
          'input[type="text"]',
          'input[type="email"]',
          'input[type="number"]',
          'input[type="submit"]',
          'input[type="image"]',
          'input[type="password"]',
          "label[for]",

          "select",
          "textarea",
          "button",
          ".link",
        ]}
      />
    </div>
  );
};

export default Cursor;

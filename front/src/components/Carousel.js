import React from "react";
import { MDBCarousel, MDBCarouselItem } from "mdb-react-ui-kit";
import G1 from "./imgs/G1.png";
import G2 from "./imgs/G2.png";
import G3 from "./imgs/G3.png";
export default function CarouselSlider() {
  return (
    <MDBCarousel showIndicators showControls fade>
      <MDBCarouselItem
        className="w-50 h-50 mx-auto d-block"
        itemId={1}
        src={G1}
        alt="..."
      ></MDBCarouselItem>

      <MDBCarouselItem
        className="w-50 mx-auto h-50 d-block"
        itemId={2}
        src={G2}
        alt="..."
      ></MDBCarouselItem>

      <MDBCarouselItem
        className="w-50 h-50 mx-auto rounded-circle d-block"
        itemId={3}
        src={G3}
        alt="..."
      ></MDBCarouselItem>
    </MDBCarousel>
  );
}

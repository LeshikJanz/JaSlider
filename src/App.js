import React from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./App.css";
import Slider from "./Slider/Slider";
import { SLIDES_RESOLUTIONS } from "./Slider/constants";

const Slide = styled.div`
  position: relative;
  ${({ disabled }) => disabled && "pointer-events: none;"};
  transform: rotate(${({ index }) => 15 * index}deg);
  top: ${({ index }) => index * 50}px;
  right: ${({ index }) => index * 30}px;
`;

function App() {
  const images = new Array(50)
    .fill(0)
    .map((img, index) => `https://picsum.photos/200/300?image=${110 + index}`);
  return (
    <div className="App">
      <div className="wrapper">
        <Slider breakpoints={SLIDES_RESOLUTIONS} showSwiperButtons>
          {images.map((img, index) => (
            <div key={img} className="slide">
              <Slide index={index}>
                <img draggable={false} src={img} alt="" />
              </Slide>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default App;

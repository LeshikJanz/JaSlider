import React, { Fragment } from "react";
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
    .map((img, index) => ({ img: `https://picsum.photos/200/300?image=${110 + index}`, index}))
    console.log("images", images)
  return (
    <div className="App">
      <div className="wrapper">
        <Slider breakpoints={SLIDES_RESOLUTIONS} showSwiperButtons>
          <Fragment>
          {images.slice(0, 10).map((elem, index) => (
            <div key={elem.img} className="slide" name={elem.index}>
              <Slide index={elem.index}>
                <img draggable={false} src={elem.img} alt="" />
              </Slide>
            </div>
          ))}
          </Fragment>
          <Fragment>
          {images.slice(10, 20).map((elem, index) => (
            <div key={elem.img} className="slide" name={elem.index}>
              <Slide index={elem.index}>
                <img draggable={false} src={elem.img} alt="" />
              </Slide>
            </div>
          ))}
          </Fragment>
        </Slider>
      </div>
    </div>
  );
}

export default App;

import React from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./App.css";
import Slider from "./Slider/Slider";
import { SLIDES_RESOLUTIONS } from "./Slider/constants";

const Slide = styled.div`
  position: relative;
  transform: rotate(${({ index, degree }) => 180 + index * 20 + degree}deg)
    translateX(360px)
    rotate(${({ index, degree }) => 180 + index * 20 + degree}deg);
  right: ${({ index }) =>
    index >= 10 ? 60 * (index - 9) : 50 * index - 420}px;
`;

let mouseDown = false;
let currentMousePosition = [0, 0];

class App extends React.Component {
  state = {
    degree: 0
  };

  slides;

  componentDidMount() {
    this.slides = document.querySelectorAll(".slide");
    console.log("this.slides", this.slides);
    let count = 0;
    setInterval(() => {
      count += 1;
      this.slides.forEach(
        (slide, index) =>
          (slide.style.transform = `rotate(${180 +
            index * 20 +
            0.5 * count}deg) translateX(360px) rotate(${180 +
            index * 20 +
            10}deg)`)
      );
    }, 50);
  }

  handleMouseDown = () => {
    mouseDown = true;
  };

  handleMouseUp = () => {
    mouseDown = false;
  };

  onMove = e => {
    const delta = 
    console.log("e.pageX", e.pageX);
  };

  moveSlides = movingDelta => {
    this.setState(prevState => ({
      degree: prevState.degree + movingDelta / 10
    }));
  };

  render() {
    const images = new Array(19)
      .fill(0)
      .map(
        (img, index) => `https://picsum.photos/200/300?image=${110 + index}`
      );
    return (
      <div className="App">
        <div
          id="wrapper"
          className="wrapper"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onMove}
        >
          <div className="swiper-wrapper">
            <div className="swiped-area disable-user-select">
              {images.map((img, index) => (
                <Slide
                  key={img}
                  name={index}
                  className="slide"
                  index={index}
                  degree={this.state.degree}
                >
                  <img draggable={false} src={img} alt="" />
                </Slide>
              ))}
            </div>
          </div>
        </div>
        <button className="moveButton" onClick={this.handleClick}>
          Move
        </button>
      </div>
    );
  }
}

export default App;

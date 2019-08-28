import React from "react";
import styled from "styled-components";
import logo from "./logo.svg";
import "./App.css";
import Slider from "./Slider/Slider";
import { SLIDES_RESOLUTIONS } from "./Slider/constants";

const Slide = styled.div`
  position: relative;
  /* transform: rotate(180deg) translateX(150px) rotate(180deg); */
  transform: rotate(${({ index, degree }) =>
    180 + index * 20 + degree}deg) translateX(360px) rotate(${({
  index,
  degree
}) => 180 + index * 20 + degree}deg);
  /* transform: rotate(${({ index }) => 15 * index}deg);
  top: ${({ index }) => index * 50 - (index > 10 ? 80 * (index - 10) : 0)}px;*/
  right: ${({ index }) => (index >= 10 ? 60 * (index - 9) : 50 * index - 420)}px; 
`;

class App extends React.Component {
  state = {
    degree: 0
  };

  handleClick = () => {
    this.setState(prevState => ({ degree: prevState.degree + 2 }));
  };

  render() {
    const images = new Array(19)
      .fill(0)
      .map(
        (img, index) => `https://picsum.photos/200/300?image=${110 + index}`
      );
    return (
      <div className="App">
        <div className="wrapper">
          <div className="swiper-wrapper">
            <div className="swiped-area disable-user-select">
              {images.map((img, index) => (
                <div key={img} className="slide" name={index}>
                  <Slide index={index} degree={this.state.degree}>
                    <img draggable={false} src={img} alt="" />
                  </Slide>
                </div>
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

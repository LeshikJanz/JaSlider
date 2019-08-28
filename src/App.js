import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Slider from "./Slider/Slider";
import { SLIDES_RESOLUTIONS } from "./Slider/constants";

function App() {
  const images = new Array(50)
    .fill(0)
    .map((img, index) => `https://picsum.photos/200/300?image=${110 + index}`);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
      </header>
      <div className="wrapper">
        <Slider breakpoints={SLIDES_RESOLUTIONS} showSwiperButtons>
          {images.map(img => (
            <div key={img} className="slide">
              
              <img
                draggable={false}
                src={img}
                alt=""
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider from "./Slider/Slider"

class App extends Component {
  slideNext = () => {

  }

  render () {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <div className="wrapper">
          <Slider>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=110" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=111" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=112" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=113" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=114" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=115" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=116" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=117" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=118" alt="" />
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Slider from "./Slider/Slider"

class App extends Component {
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
              <img draggable={false} src="https://picsum.photos/200/300?image=100" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=101" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=102" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=103" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=104" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=105" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=106" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=107" alt="" />
            </div>
            <div className="slide">
              <img draggable={false} src="https://picsum.photos/200/300?image=108" alt="" />
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;

// @flow
import React from "react"
import "./styles.css"

class Slider extends React.Component<{}> {
  initialPositionX: number
  transformedX: number = 0
  deltaX: number
  isMouseDown: boolean
  sliderRef: HTMLDivElement

  componentDidMount () {
    this.sliderRef.addEventListener("dragstart", function (e) {
      const img = document.createElement("img");
      img.style.opacity = 0;
      e.dataTransfer.setDragImage(img, 0, 0);
    })
  }

  onDrag = (e) => {
    if (e.screenX !== 0 && this.isMouseDown) {
      this.deltaX = e.screenX - this.initialPositionX + this.transformedX
      this.sliderRef.style.transform = `translate(${this.deltaX}px, 0)`
    }
  }

  onMouseDown = (e) => {
    this.initialPositionX = e.screenX
    this.isMouseDown = true
  }

  onMouseUp = ({ screenX }) => {
    this.transformedX = this.deltaX
    this.isMouseDown = false
  }

  checkIfMouseOutOfScreen = ({ screenX, screenY }) => {
    if (window.innerWidth > screenX) {

    }
  }

  onMouseLeave = () => {
    console.log("onMouseOut")
  }


  render () {
    return (
      <div className="main-slider">
        <div
          ref={ref => {
            this.sliderRef = ref
          }}
          className="center-block"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
          onMouseMove={this.onDrag}
          onMouseLeave={this.onMouseLeave}
        >
          <img draggable={false} src="https://picsum.photos/200/300?image=100" alt="" />
          <img draggable={false} src="https://picsum.photos/200/300?image=101" alt="" />
          <img draggable={false} src="https://picsum.photos/200/300?image=102" alt="" />
          {/*<img src="https://picsum.photos/200/300?image=103" alt="" />*/}
          {/*<img src="https://picsum.photos/200/300?image=104" alt="" />*/}
          {/*<img src="https://picsum.photos/200/300?image=105" alt="" />*/}
          {/*<img src="https://picsum.photos/200/300?image=106" alt="" />*/}
        </div>
      </div>
    )
  }
}

export default Slider

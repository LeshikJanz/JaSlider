// @flow
import React from "react"

function withMouseHandlers (Component: any) {
  return class Slider extends React.Component<{}> {
    initialPositionX: number
    transformedX: number = 0
    deltaX: number
    isMouseDown: boolean
    ref: HTMLDivElement
    slides: HTMLDivElement[]

    state = {
      slideHeight: 0,
      slideWidth: 0,
      slidesPerView: 4,
    }

    componentDidMount () {
      document.addEventListener("mouseup", this.onMouseUp, false)
      document.addEventListener("mousemove", this.onMouseMove, false)
      if (this.ref) {
        this.slides = this.ref.querySelectorAll(".slide")
        this.mainSlider = this.ref.querySelector(".main-slider")
        console.log("this.slides")
        console.log(this.slides)
        if (this.slides && this.slides.length) {
          this.setState({
            slideHeight: this.slides[0].offsetHeight,
            slideWidth: this.slides[0].offsetWidth,
          })
        }
      }
    }

    onMouseMove = (e) => {
      if (e.screenX !== 0 && this.isMouseDown) {
        this.moveSlider(e.screenX - this.initialPositionX + this.transformedX)
      }
    }

    moveSlider = (deltaX: number) => {
      this.deltaX = deltaX
      this.ref.style.transform = `translate(${deltaX}px, 0)`
    }

    onMouseDown = (e) => {
      this.disableTransition()
      this.initialPositionX = e.screenX
      this.isMouseDown = true
    }

    onMouseUp = () => {
      this.transformedX = this.deltaX
      this.isMouseDown = false
      this.alignItems()
    }

    alignItems = () => {
      this.enableTransition()
      const swipedSlidesCount = (this.deltaX / this.state.slideWidth).toFixed()
      this.moveSlider(swipedSlidesCount * this.state.slideWidth)
      this.transformedX = this.deltaX
    }

    enableTransition = () =>
      this.ref.style.transition = ".5s ease-in-out"

    disableTransition = () =>
      this.ref.style.transition = "none"

    render () {
      return (
        <div
          ref={ref => {
            this.ref = ref
          }}
          className="main-slider"
          onMouseDown={this.onMouseDown}
        >
          <Component {...this.props} />
        </div>
      )
    }
  }
}

export default withMouseHandlers
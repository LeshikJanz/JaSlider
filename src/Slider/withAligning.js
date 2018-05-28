// @flow
import React from "react"

function withAligning (Component: any) {
  return class Slider extends React.Component<{}> {
    ref: HTMLDivElement
    mainSlider: HTMLDivElement
    state = {
      slideHeight: 0,
      slideWidth: 0,
      slidesPerView: 4,
    }

    componentDidMount () {
      if (this.ref) {
        const slide = this.ref.querySelector(".slide")
        this.mainSlider = this.ref.querySelector(".main-slider")
        if (slide) {
          this.setState({
            slideHeight: slide.offsetHeight,
            slideWidth: slide.offsetWidth,
          })
        }
      }
    }

    render () {
      console.log("this.state")
      console.log(this.state)
      return (
        <div
          ref={ref => {
            this.ref = ref
          }}>
          <Component
            {...this.props} />
        </div>
      )
    }
  }
}

export default withAligning
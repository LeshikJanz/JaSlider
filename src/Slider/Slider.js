// @flow
import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import PrevRenderedSlides from "./PrevRenderedSlides"
import NextRenderedSlides from "./NextRenderedSlides"
import { getNextAdditionalSlides } from "./utils";
import { getSlideBySlidesOffset } from "./utils";
import { MIN_SHADOW_SLIDES_COUNT } from "./constants";
import { DEFAULT_SLIDES_PER_VIEW } from "./constants";
import { SLIDES_RESOLUTIONS } from "./constants";
import { ANIMATION_DURATION_MS } from "./constants";
import "./styles.css"

type Props = {
  children: HTMLDivElement[],
}

class Slider extends React.Component<{}> {
  initialPositionX: number
  deltaX: number = 0
  isMouseDown: boolean
  wrapperRef: HTMLDivElement
  swipedAreaRef: HTMLDivElement
  slides: HTMLDivElement[]

  state = {
    slideWidth: 0,
    renderedSlides: [],
    slidesPerView: DEFAULT_SLIDES_PER_VIEW,
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.onMouseUp, false)
    document.addEventListener("mousemove", this.onMouseMove, false)
    window.addEventListener('resize', this.onResize)
    this.onResize()
    this.setUpSlider()
  }

  componentDidUpdate() {
    if (!this.state.slideWidth) {
      this.setSlideDimensions()
    }
  }

  setUpSlider = () => {
    if (this.swipedAreaRef) {
      this.slides = React.Children.map(this.props.children, (child, index) =>
        React.cloneElement(child, {}))
      if (this.slides && this.slides.length) {
        this.setState({
          renderedSlides: this.slides.filter((s, i) => i < this.state.slidesPerView)
        })
      }
    }
  }

  setSlideDimensions = () => {
    if (this.swipedAreaRef) {
      const container = document.createElement("div")
      ReactDOM.render(this.props.children, container)
      const slide = document.querySelector(".slide")

      this.setState({ slideWidth: slide.offsetWidth }, this.onResize)
    }
  }

  updateSlidesWrapperStyles = (slideWidth: number = this.state.slideWidth) => {
    this.wrapperRef.style.maxWidth = `${slideWidth * this.state.slidesPerView}px`
    if (this.state.slidesPerView > DEFAULT_SLIDES_PER_VIEW) {
      this.swipedAreaRef.style.marginLeft = `${-this.state.slidesPerView * slideWidth}px`
    } else {
      this.swipedAreaRef.style.marginLeft = `${-MIN_SHADOW_SLIDES_COUNT * slideWidth}px`
    }
  }

  onResize = () => {
    let slidesPerView = DEFAULT_SLIDES_PER_VIEW
    Object.keys(SLIDES_RESOLUTIONS)
      .forEach(resolution => {
        if (window.innerWidth >= resolution) {
          slidesPerView = SLIDES_RESOLUTIONS[resolution]
        }
      })
    this.setUpSlider()
    this.setState({ slidesPerView }, () => this.updateSlidesWrapperStyles())
  }

  onMouseMove = (e) => {
    if (e.screenX !== 0 && this.isMouseDown) {
      this.moveSlider(e.screenX - this.initialPositionX)
    }
  }

  moveSlider = (deltaX: number) => {
    this.deltaX = deltaX
    this.swipedAreaRef.style.transform = `translate(${deltaX}px, 0)`
  }

  onMouseDown = (e) => {
    this.disableTransition()
    this.initialPositionX = e.screenX
    this.isMouseDown = true
  }

  onMouseUp = () => {
    this.isMouseDown = false
    this.alignItems()
  }

  alignItems = () => {
    this.enableTransition()
    const swipedSlidesCount = (this.deltaX / this.state.slideWidth).toFixed()
    this.moveSlider(swipedSlidesCount * this.state.slideWidth)
    setTimeout(this.updateRenderedSlides, ANIMATION_DURATION_MS)
  }

  enableTransition = () =>
    this.swipedAreaRef.style.transition = ".5s ease-in-out"

  disableTransition = () =>
    this.swipedAreaRef.style.transition = "none"

  slideNext = () => {
    this.enableTransition()
    const nextPosition = 0 - this.state.slideWidth * this.state.slidesPerView
    this.moveSlider(nextPosition)
  }

  slidePrev = () => {
    this.enableTransition()
    const prevPosition = this.state.slideWidth * this.state.slidesPerView
    this.moveSlider(prevPosition)
  }

  updateRenderedSlides = () => {
    if (-this.deltaX % this.state.slideWidth === 0) {
      const swipedSlidesCount = -this.deltaX / this.state.slideWidth
      const currentSlide =
        getSlideBySlidesOffset(this.state.renderedSlides[0], swipedSlidesCount, this.slides)
      const additionalSlides =
        getNextAdditionalSlides(currentSlide, this.state.slidesPerView - 1, this.slides)
      this.clearTransformOffset()
      this.setState({ renderedSlides: [currentSlide, ...additionalSlides] })
    }
  }

  clearTransformOffset = () => {
    this.deltaX = 0
    this.disableTransition()
    this.swipedAreaRef.style.transform = `translate(0, 0)`
  }

  render() {
    const { renderedSlides, slidesPerView } = this.state
    return (
      <Fragment>
        <button
          disabled={this.deltaX % this.state.slideWidth !== 0}
          onClick={this.slidePrev}
        >Prev
        </button>
        <div
          ref={ref => {
              this.wrapperRef = ref
            }}
          className="swiper-wrapper"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        >
          <div
            className="swiped-area"
            ref={ref => {this.swipedAreaRef = ref}}
          >
            {
              this.slides && renderedSlides.length &&
              <PrevRenderedSlides
                firstViewSlide={renderedSlides[0]}
                slides={this.slides}
                slidesPerView={slidesPerView > MIN_SHADOW_SLIDES_COUNT
                  ? slidesPerView : MIN_SHADOW_SLIDES_COUNT}
              />
            }
            {
              renderedSlides && renderedSlides.map((slide, index) =>
                <Fragment key={index}>{slide}</Fragment>)}
            {
              this.slides && renderedSlides.length &&
              <NextRenderedSlides
                lastViewSlide={renderedSlides[slidesPerView - 1]}
                slides={this.slides}
                slidesPerView={slidesPerView > MIN_SHADOW_SLIDES_COUNT
                  ? slidesPerView : MIN_SHADOW_SLIDES_COUNT}
              />
            }
          </div>
        </div>
        <button onClick={this.slideNext}>Next
        </button>
      </Fragment>
    )
  }
}

export default Slider

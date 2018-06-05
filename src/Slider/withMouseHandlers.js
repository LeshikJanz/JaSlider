// @flow
import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import PrevRenderedSlides from "./PrevRenderedSlides"
import NextRenderedSlides from "./NextRenderedSlides"
import { getNextAdditionalSlides } from "./utils";
import { getSlideBySlidesOffset } from "./utils";

const SLIDES_PER_VIEW = 4
const MIN_SHADOW_SLIDES_COUNT = 5

function withMouseHandlers(Component: any) {
  return class Slider extends React.Component<{}> {
    initialPositionX: number
    deltaX: number
    isMouseDown: boolean
    wrapperRef: HTMLDivElement
    swipedAreaRef: HTMLDivElement
    slides: HTMLDivElement[]

    state = {
      slideHeight: 0,
      slideWidth: 0,
      slidesPerView: SLIDES_PER_VIEW,
      renderedSlides: [],
    }

    componentDidMount() {
      document.addEventListener("mouseup", this.onMouseUp, false)
      document.addEventListener("mousemove", this.onMouseMove, false)
      window.addEventListener('resize', this.onResize)
      this.setUpSlider()
    }

    componentDidUpdate() {
      if (!this.state.slideHeight && !this.state.slideWidth) {
        this.setSlideDimensions()
      }
    }

    onResize = () => {
      console.log("onResize")
    }

    setUpSlider = () => {
      if (this.swipedAreaRef) {
        this.slides = React.Children.map(this.props.children, (child, index) =>
          React.cloneElement(child, {}))
        if (this.slides && this.slides.length) {
          if (!this.state.firstViewSlide) {
            this.setState({ renderedSlides: this.slides.filter((s, i) => i < SLIDES_PER_VIEW) })
          } else {
            this.setState({ renderedSlides: getNextAdditionalSlides(this.firstViewSlide, SLIDES_PER_VIEW, this.slides) })
          }
        }
      }
    }

    setSlideDimensions = () => {
      if (this.swipedAreaRef) {
        const container = document.createElement("div")
        ReactDOM.render(this.props.children, container)
        const slide = document.querySelector(".slide")

        this.setState({
          slideHeight: slide.offsetHeight,
          slideWidth: slide.offsetWidth,
        })
        this.wrapperRef.style.maxWidth = `${slide.offsetWidth * SLIDES_PER_VIEW}px`
        this.swipedAreaRef.style.marginLeft = `${-SLIDES_PER_VIEW * slide.offsetWidth}px`
      }
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

    onMouseUp = (e) => {
      this.isMouseDown = false
      this.alignItems()
    }

    alignItems = () => {
      this.enableTransition()
      const swipedSlidesCount = (this.deltaX / this.state.slideWidth).toFixed()
      this.moveSlider(swipedSlidesCount * this.state.slideWidth)
      setTimeout(() => {
        this.updateRenderedSlides()
      }, 500)
    }

    enableTransition = () =>
      this.swipedAreaRef.style.transition = ".5s ease-in-out"

    disableTransition = () =>
      this.swipedAreaRef.style.transition = "none"

    slideNext = (count: number = 1) => {
      this.enableTransition()
      const nextPosition = 0 - this.state.slideWidth * count
      this.moveSlider(nextPosition)
    }

    slidePrev = (count: number = 1) => {
      this.enableTransition()
      const prevPosition = this.state.slideWidth * count
      this.moveSlider(prevPosition)
    }

    updateRenderedSlides = () => {
      if (-this.deltaX % this.state.slideWidth === 0) {
        const swipedSlidesCount = -this.deltaX / this.state.slideWidth
        const currentSlide =
          getSlideBySlidesOffset(this.state.renderedSlides[0], swipedSlidesCount, this.slides)
        const additionalSlides =
          getNextAdditionalSlides(currentSlide, SLIDES_PER_VIEW - 1, this.slides)
        const renderedSlides = [currentSlide, ...additionalSlides]
        this.deltaX = 0
        this.disableTransition()
        this.swipedAreaRef.style.transform = `translate(0, 0)`
        this.setState({ renderedSlides })
      }
    }

    render() {
      const { slidesPerView, renderedSlides } = this.state
      return (
        <Fragment>
          <button onClick={() => this.slidePrev(slidesPerView)}>Prev</button>
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
              <Component
                {...this.props}
                slides={renderedSlides}
                slideNext={this.slideNext}
                slidePrev={this.slidePrev}
              />
              {
                this.slides && renderedSlides.length &&
                <NextRenderedSlides
                  lastViewSlide={renderedSlides[SLIDES_PER_VIEW - 1]}
                  slides={this.slides}
                  slidesPerView={slidesPerView > MIN_SHADOW_SLIDES_COUNT
                  ? slidesPerView : MIN_SHADOW_SLIDES_COUNT}
                />
              }
            </div>
          </div>
          <button onClick={() => this.slideNext(slidesPerView)}>Next</button>
        </Fragment>
      )
    }
  }
}

export default withMouseHandlers

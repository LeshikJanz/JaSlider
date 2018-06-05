// @flow
import React, { Fragment } from "react"
import ReactDOM from "react-dom"
import PrevRenderedSlides from "./PrevRenderedSlides"
import NextRenderedSlides from "./NextRenderedSlides"
import { getNextAdditionalSlides } from "./utils";

const SLIDES_PER_VIEW = 4
const RENDERED_SLIDES_COUNT = SLIDES_PER_VIEW * 2

function withMouseHandlers(Component: any) {
  return class Slider extends React.Component<{}> {
    initialPositionX: number
    transformedX: number = 0
    deltaX: number
    isMouseDown: boolean
    wrapperRef: HTMLDivElement
    swipedAreaRef: HTMLDivElement
    slides: HTMLDivElement[]
    currentSlide: HTMLDivElement

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
      this.transformedX = 0
      this.setUpSlider()
      setInterval(() => this.showData(), 3000)
    }

    componentDidUpdate() {
      if (!this.state.slideHeight && !this.state.slideWidth) {
        this.setSlideDimensions()
      }
    }

    onResize = () => {
      console.log("this.wrapperRef.offsetWidth")
      console.log(this.wrapperRef.offsetWidth)
      this.swipedAreaRef.style.width = "800px"
    }

    setUpSlider = () => {
      if (this.swipedAreaRef) {
        this.slides = React.Children.map(this.props.children, (child, index) =>
          React.cloneElement(child, {}))
        if (this.slides && this.slides.length) {
          if (!this.state.firstViewSlide) {
            this.setState({ renderedSlides: this.slides.filter((s, i) => i < RENDERED_SLIDES_COUNT) })
          } else {
            this.setState({ renderedSlides: getNextAdditionalSlides(this.firstViewSlide, RENDERED_SLIDES_COUNT, this.slides) })
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
      }
    }

    onMouseMove = (e) => {
      if (e.screenX !== 0 && this.isMouseDown) {
        this.moveSlider(e.screenX - this.initialPositionX + this.transformedX)
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
      this.transformedX = this.deltaX
      this.isMouseDown = false
      this.alignItems()
    }

    alignItems = () => {
      this.enableTransition()
      const swipedSlidesCount = (this.deltaX / this.state.slideWidth).toFixed()
      this.moveSlider(swipedSlidesCount * this.state.slideWidth)
      this.transformedX = this.deltaX
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
      const nextPosition = (this.transformedX || 0) - this.state.slideWidth * count
      console.log("count")
      console.log(count)
      console.log("nextPosition")
      console.log(nextPosition)
      this.moveSlider(nextPosition)
      this.transformedX = nextPosition
    }

    slidePrev = (count: number = 1) => {
      this.enableTransition()
      const prevPosition = (this.transformedX || 0) + this.state.slideWidth * count
      this.moveSlider(prevPosition)
      this.transformedX = prevPosition
    }

    updateRenderedSlides = () => {
      if (-this.deltaX % this.state.slideWidth === 0) {
        const swipedSlidesCount = -this.deltaX / this.state.slideWidth
        const currentSlide = this.state.renderedSlides[swipedSlidesCount]
        console.log("currentSlide")
        console.log(currentSlide)
        const renderedSlides = [currentSlide,
          ...getNextAdditionalSlides(currentSlide, RENDERED_SLIDES_COUNT - 1, this.slides)]
        this.transformedX = this.deltaX = 0
        this.disableTransition()
        this.swipedAreaRef.style.transform = `translate(${this.transformedX}, 0)`
        this.setState({ renderedSlides })
      }
    }

    showData = () => {
    }

    render() {
      return (
        <Fragment>
          <button onClick={() => this.slidePrev(4)}>Prev</button>
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
              ref={ref => {
                this.swipedAreaRef = ref
              }}
            >
              {/*<PrevRenderedSlides*/}
              {/*firstViewSlide={this.firstViewSlide}*/}
              {/*slides={this.slides}*/}
              {/*/>*/}
              <Component
                {...this.props}
                slides={this.state.renderedSlides}
                slideNext={this.slideNext}
                slidePrev={this.slidePrev}
              />
              {
                this.slides && this.state.renderedSlides.length &&
                <NextRenderedSlides
                  lastViewSlide={this.state.renderedSlides[SLIDES_PER_VIEW - 1]}
                  slides={this.slides}
                />
              }
            </div>
          </div>
          <button onClick={() => this.slideNext(4)}>Next</button>
        </Fragment>
      )
    }
  }
}

export default withMouseHandlers

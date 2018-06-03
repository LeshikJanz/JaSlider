// @flow
import React, { Fragment } from "react"
import ReactDOM from "react-dom"

const SLIDES_PER_VIEW = 4
const MIN_SHADOW_SLIDES = 2 * SLIDES_PER_VIEW

function withMouseHandlers(Component: any) {
  return class Slider extends React.Component<{}> {
    initialPositionX: number
    transformedX: number = 0
    deltaX: number
    isMouseDown: boolean
    wrapperRef: HTMLDivElement
    swipedAreaRef: HTMLDivElement
    slides: HTMLDivElement[]
    currentSlideIndex: number

    state = {
      slideHeight: 0,
      slideWidth: 0,
      slidesPerView: SLIDES_PER_VIEW,
      renderedSlides: [],
      lastRenderedSlideIndex: 0,
      firstRenderedSlideIndex: 0,
    }

    componentDidMount() {
      document.addEventListener("mouseup", this.onMouseUp, false)
      document.addEventListener("mousemove", this.onMouseMove, false)
      window.addEventListener('resize', this.onResize)
      this.transformedX = 0
      this.setUpSlider()
      setInterval(() => {
        this.showData()
      }, 3000)
    }

    componentDidUpdate() {
      if (!this.state.slideHeight && !this.state.slideWidth) {
        this.setSlideDimensions()
      }
    }

    onResize = () => {
      this.swipedAreaRef.style.width = "800px"
    }

    setUpSlider = () => {
      if (this.swipedAreaRef) {
        this.slides = React.Children.map(this.props.children, (child, index) =>
          React.cloneElement(child, {}))
        if (this.slides && this.slides.length) {
          this.setState({ renderedSlides: this.slides, lastRenderedSlideIndex: this.slides.length })
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

    setSlideIndex = (deltaX: number = 0) => {
      if (deltaX % this.state.slideWidth === 0) {
        this.currentSlideIndex = -(deltaX / this.state.slideWidth)
      }
    }

    moveSlider = (deltaX: number) => {
      this.deltaX = deltaX
      this.swipedAreaRef.style.transform = `translate(${deltaX}px, 0)`
      this.setSlideIndex(deltaX)
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
      setTimeout(this.checkForNewSlides, 1000)
    }

    enableTransition = () =>
      this.swipedAreaRef.style.transition = ".5s ease-in-out"

    disableTransition = () =>
      this.swipedAreaRef.style.transition = "none"

    slideNext = (count: number = 1) => {
      this.enableTransition()
      const nextPosition = (this.transformedX || 0) - this.state.slideWidth * count
      this.moveSlider(nextPosition)
      this.transformedX = nextPosition
    }

    slidePrev = (count: number = 1) => {
      this.enableTransition()
      const prevPosition = (this.transformedX || 0) + this.state.slideWidth * count
      this.moveSlider(prevPosition)
      this.transformedX = prevPosition
    }

    slideTo = (slideIndex: number) => {
      this.enableTransition()
      const nextPosition = -(this.state.slideWidth * slideIndex)
      this.moveSlider(nextPosition)
      this.transformedX = nextPosition
    }

    checkForNewSlides = () => {
      if (this.state.lastRenderedSlideIndex - this.currentSlideIndex - this.state.slidesPerView <= MIN_SHADOW_SLIDES) {
        console.log("renderNextSlides")
        const nextSlides = this.getNextAdditionalSlides(MIN_SHADOW_SLIDES)
        this.setState(prevState => ({
          renderedSlides: [...prevState.renderedSlides, ...nextSlides],
          lastRenderedSlideIndex: prevState.lastRenderedSlideIndex + nextSlides.length
        }))
      }
    }

    getPrevAdditionalSlides = (currentIndex: number, count: number = SLIDES_PER_VIEW) => {
      const additionalSlides = []
      for (let i = 1; i <= count; i++) {
        if (this.slides[currentIndex - i]) {
          additionalSlides.push(this.slides[currentIndex - i])
        } else {
          additionalSlides.push(this.slides[this.slides.length - i + additionalSlides.length])
        }
      }
      return additionalSlides
    }

    getNextAdditionalSlides = (count: number = SLIDES_PER_VIEW) => {
      const additionalSlides = []
      const slides = new Array(...this.slides)
      const renderedSlides = new Array(...this.state.renderedSlides)
      const lastSlide = renderedSlides.pop()
      const initialSlidesFoundedIndex = this.slides.indexOf(lastSlide)
      for (let i = 1; i <= count; i++) {
        if (this.slides[initialSlidesFoundedIndex + i]) {
          additionalSlides.push(slides[initialSlidesFoundedIndex + i])
        } else {
          additionalSlides.push(slides.shift())
        }
      }
      return additionalSlides
    }

    showData = () => {
    }

    render() {
      return (
        <Fragment>
          <button onClick={() => this.slidePrev(SLIDES_PER_VIEW)}>Prev</button>
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
              <Component
                {...this.props}
                slides={this.state.renderedSlides}
                slideNext={this.slideNext}
                slidePrev={this.slidePrev}
              />
            </div>
          </div>
          <button onClick={() => this.slideNext(SLIDES_PER_VIEW)}>Next</button>
          <button onClick={() => this.slideTo(2)}>Slide to the second</button>
        </Fragment>
      )
    }
  }
}

export default withMouseHandlers

// @flow
import * as React from "react"
import PrevRenderedSlides from "./PrevRenderedSlides"
import NextRenderedSlides from "./NextRenderedSlides"
import { getNextAdditionalSlides, getSlideBySlidesOffset, joinClasses } from "./utils"
import {
  MIN_SHADOW_SLIDES_COUNT,
  DEFAULT_SLIDES_PER_VIEW,
  ANIMATION_DURATION_MS,
} from "./constants"
import "./styles.css"

type Props = {
  breakpoints: { [string]: number },
  wrapperClassname?: string,
  children: React.Node[],
}

type State = {
  slideWidth: number,
  renderedSlides: HTMLDivElement[],
  slidesPerView: number,
}

class Slider extends React.Component<Props, State> {
  mounted: boolean
  initialPositionX: number
  isMouseDown: boolean
  containerRef: ?HTMLDivElement
  wrapperRef: ?HTMLDivElement
  swipedAreaRef: ?HTMLDivElement
  slides: HTMLDivElement[]
  draggableSlide: ?HTMLDivElement
  scrollY: number

  state = {
    slideWidth: 0,
    renderedSlides: [],
    slidesPerView: DEFAULT_SLIDES_PER_VIEW,
  }

  componentDidMount () {
    this.mounted = true
    document.addEventListener("mouseup", this.onMouseUp)
    document.addEventListener("mousemove", this.onMouseMove)
    window.addEventListener("resize", this.onResize)
    this.setUpSlider(this.props.children, this.onResize)
  }

  componentWillReceiveProps (nextProps: Props) {
    this.setUpSlider(nextProps.children, this.onResize)
  }

  componentDidUpdate () {
    if (!this.state.slideWidth) {
      this.setSlideWidth()
    }
  }

  componentWillUnmount () {
    this.mounted = false
    document.removeEventListener("mouseup", this.onMouseUp)
    document.removeEventListener("mousemove", this.onMouseMove)
    window.removeEventListener("resize", this.onResize)
  }

  deltaX: number = 0
  transitionStartedAt: number = 0

  setUpSlider = (children: React.Node[] = this.props.children, callback?: Function) => {
    if (this.swipedAreaRef && children && children.length) {
      this.slides = React.Children.toArray(children)
      if (this.slides && this.slides.length) {
        this.setState({
          renderedSlides: this.slides.filter((s, i) => i < this.getSlidesPerView()),
        }, callback)
      }
    }
  }

  setSlideWidth = () => {
    if (this.swipedAreaRef) {
      const slide = this.swipedAreaRef.querySelector(".slide")
      if (slide) {
        this.setState({ slideWidth: slide.clientWidth })
      }
    }
  }

  updateSlidesWrapperStyles = (slideWidth: number = this.state.slideWidth) => {
    if (slideWidth && this.wrapperRef) {
      this.wrapperRef.style.maxWidth = `${slideWidth * this.state.slidesPerView}px`
    }
    if (this.swipedAreaRef) {
      if (this.slides && this.slides.length > this.state.slidesPerView) {
        const shadowSlidesCount = this.slides.length < MIN_SHADOW_SLIDES_COUNT
          ? this.slides.length : MIN_SHADOW_SLIDES_COUNT
        this.swipedAreaRef.style.marginLeft = `${-shadowSlidesCount * slideWidth}px`
      } else {
        this.swipedAreaRef.style.marginLeft = "0"
      }
    }
  }

  getSlidesPerView = () => {
    let slidesPerView = 1
    Object.keys(this.props.breakpoints)
      .forEach(resolution => {
        if (window.innerWidth >= resolution) {
          slidesPerView = this.props.breakpoints[resolution]
        }
      })
    return slidesPerView
  }

  onResize = () => {
    const slidesPerView = this.getSlidesPerView()
    this.setState({ slidesPerView }, () => {
      this.updateSlidesWrapperStyles()
      this.updateRenderedSlides()
    })
    if (!this.isSwipingAvailable() && this.swipedAreaRef) {
      this.swipedAreaRef.style.marginLeft = "0"
      this.setUpSlider()
    }
  }

  moveSlider = (deltaX: number) => {
    this.deltaX = deltaX
    if (this.swipedAreaRef) {
      this.swipedAreaRef.style.transform = `translate3d(${deltaX}px, 0, 0)`
    }
  }

  onMouseDown = (e: MouseEvent & { nativeEvent: { which: number } }) => {
    if (this.isSwipingAvailable() && e.nativeEvent.which === 1 && this.isTransitionEnded()) {
      this.scrollY = window.scrollY
      this.disableTransition()
      this.initialPositionX = Number(e.screenX)
      this.isMouseDown = true
    }
  }

  onMouseMove = (e: MouseEvent) => {
    const screenX = Number(e.screenX)
    if (screenX !== 0 && this.isMouseDown) {
      this.disableSlidePointerEvents(e)
      this.moveSlider(screenX - this.initialPositionX)
    }
  }

  onMouseUp = () => {
    if (this.isSwipingAvailable() && this.mounted) {
      this.enableSlidePointerEvents()
      this.isMouseDown = false
      this.alignItems()
    }
  }

  alignItems = () => {
    this.enableTransition()
    const swipedSlidesCount = Number((this.deltaX / this.state.slideWidth).toFixed())
    this.moveSlider(swipedSlidesCount * this.state.slideWidth)
    setTimeout(this.updateRenderedSlides, ANIMATION_DURATION_MS)
  }

  enableTransition = () => {
    if (this.swipedAreaRef) {
      this.swipedAreaRef.style.transition = ".5s ease-in-out"
      this.transitionStartedAt = new Date().getTime()
    }
  }

  disableTransition = () => {
    if (this.swipedAreaRef) {
      this.swipedAreaRef.style.transition = "none"
    }
  }

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

  enableSlidePointerEvents = () => {
    if (this.draggableSlide) {
      this.draggableSlide.style.pointerEvents = "auto"
      this.draggableSlide = null
    }
  }

  disableSlidePointerEvents = (e: { target: any } & MouseEvent) => {
    if (!this.draggableSlide) {
      this.draggableSlide = e.target.closest(".slide")
      this.draggableSlide.style.pointerEvents = "none"
    }
  }

  updateRenderedSlides = () => {
    if (-this.deltaX % this.state.slideWidth === 0 && this.mounted) {
      const swipedSlidesCount = -this.deltaX / this.state.slideWidth
      const currentSlide =
        getSlideBySlidesOffset(this.state.renderedSlides[0], swipedSlidesCount, this.slides)
      const additionalSlides =
        getNextAdditionalSlides(currentSlide, this.state.slidesPerView - 1 || 1, this.slides)
          .filter(slide => slide !== currentSlide)
      this.clearTransformOffset()
      this.setState({ renderedSlides: [currentSlide, ...additionalSlides] })
    }
  }

  clearTransformOffset = () => {
    this.deltaX = 0
    this.disableTransition()
    if (this.swipedAreaRef) {
      this.swipedAreaRef.style.transform = `translate3d(0, 0, 0)`
    }
  }

  isSwipingAvailable = () => this.props.children &&
    this.props.children.length > this.state.slidesPerView

  isTransitionEnded = () =>
    new Date().getTime() - this.transitionStartedAt >= ANIMATION_DURATION_MS

  render () {
    const { wrapperClassname = "" } = this.props
    const { renderedSlides, slidesPerView } = this.state
    return (
      <div ref={ref => {
        this.containerRef = ref
      }} className={joinClasses("game-container", wrapperClassname)}
      >
        <div
          ref={ref => {
            this.wrapperRef = ref
          }}
          className="swiper-wrapper"
          onMouseDown={this.onMouseDown}
          onMouseUp={this.onMouseUp}
        >
          <div
            className="swiped-area disable-user-select"
            ref={ref => {
              this.swipedAreaRef = ref
            }}
          >
            {
              this.slides && this.slides.length > slidesPerView && renderedSlides.length &&
              <PrevRenderedSlides
                firstViewSlide={renderedSlides[0]}
                slides={this.slides}
                slidesPerView={this.slides.length < MIN_SHADOW_SLIDES_COUNT
                  ? this.slides.length : MIN_SHADOW_SLIDES_COUNT}
              />
            }
            {
              renderedSlides && renderedSlides.map((slide, index) =>
                <React.Fragment key={index}>{slide}</React.Fragment>
              )}
            {
              this.slides && this.slides.length > slidesPerView && renderedSlides.length &&
              <NextRenderedSlides
                lastViewSlide={renderedSlides[slidesPerView - 1]}
                slides={this.slides}
                slidesPerView={this.slides.length < MIN_SHADOW_SLIDES_COUNT
                  ? this.slides.length : MIN_SHADOW_SLIDES_COUNT}
              />
            }
          </div>
        </div>
        <div
          className={joinClasses("swiper-button-prev",
            !this.isSwipingAvailable() && "swiper-button-disabled")}
          onClick={this.slidePrev}
        />
        <div
          className={joinClasses("swiper-button-next",
            !this.isSwipingAvailable() && "swiper-button-disabled")}
          onClick={this.slideNext}
        />
      </div>
    )
  }
}

export default Slider

// @flow
import React, { Fragment } from "react"
import { getSlideBySlidesOffset, getNextAdditionalSlides } from "./utils";

type Props = {
  firstViewSlide: HTMLDivElement,
  slides: HTMLDivElement[],
  slidesPerView: number,
}

type State = {
  prevSlides: HTMLDivElement[],
}

class PrevRenderedSlides extends React.Component<Props, State> {
  state = {
    prevSlides: [],
  }

  componentWillReceiveProps({ firstViewSlide, slidesPerView, slides }) {
    const prevFirstSlide = getSlideBySlidesOffset(firstViewSlide, -slidesPerView - 1, slides)
    const prevSlides = getNextAdditionalSlides(prevFirstSlide, slidesPerView, slides)
    this.setState({ prevSlides })
  }

  render() {
    return (<Fragment>{this.state.prevSlides}</Fragment>)
  }
}

export default PrevRenderedSlides

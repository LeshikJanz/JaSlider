// @flow
import React, { Fragment } from "react"
import { getNextAdditionalSlides } from "./utils";

type Props = {
  lastViewSlide: HTMLDivElement,
  slides: HTMLDivElement[],
  slidesPerView: number,
}

type State = {
  nextSlides: HTMLDivElement[],
}

class NextRenderedSlides extends React.Component<Props, State> {
  state = {
    nextSlides: [],
  }

  componentWillReceiveProps({ lastViewSlide, slidesPerView, slides }) {
    const nextSlides = getNextAdditionalSlides(lastViewSlide, slidesPerView, slides)
    this.setState({ nextSlides })
  }

  render() {
    console.log("this.state.nextSlides")
    console.log(this.state.nextSlides)
    return (<Fragment>{this.state.nextSlides}</Fragment>)
  }
}

export default NextRenderedSlides

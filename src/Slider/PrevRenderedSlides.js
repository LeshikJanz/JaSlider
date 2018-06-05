// @flow
import React, { Fragment } from "react"
import { getPrevAdditionalSlides } from "./utils";

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

  componentWillReceiveProps() {
    console.log("this.props.firstViewSlide")
    console.log(this.props.firstViewSlide)
    const prevSlides = getPrevAdditionalSlides(this.props.firstViewSlide, this.props.slidesPerView, this.props.slides)
    console.log("prevSlides")
    console.log(prevSlides)
    this.setState({ prevSlides })
  }

  render() {
    return (<Fragment>{this.state.prevSlides}</Fragment>)
  }
}

export default PrevRenderedSlides

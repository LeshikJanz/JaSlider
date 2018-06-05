// @flow
import React, { Fragment } from "react"
import { getNextAdditionalSlides } from "./utils";

type Props = {
  lastViewSlide: HTMLDivElement,
  slides: HTMLDivElement[],
}

type State = {
  nextSlides: HTMLDivElement[],
}

class NextRenderedSlides extends React.Component<Props, State> {
  state = {
    nextSlides: [],
  }

  componentWillReceiveProps() {
    const nextSlides = getNextAdditionalSlides(this.props.lastViewSlide, 4, this.props.slides)
    this.setState({ nextSlides })
  }

  render() {
    return (<Fragment>{this.state.nextSlides}</Fragment>)
  }
}

export default NextRenderedSlides

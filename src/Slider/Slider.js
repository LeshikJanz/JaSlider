// @flow
import React, { Fragment } from "react"
import "./styles.css"
import { compose } from "redux"
import withMouseHandlers from "./withMouseHandlers"

type Props = {
  children: HTMLDivElement[],
}

class Slider extends React.Component<Props> {
  render () {
    const { slides } = this.props
    return (
      <Fragment>
        {slides && slides.map((slide, index) => <div key={index}>{slide}</div>)}
      </Fragment>
    )
  }
}

export default compose(
  withMouseHandlers,
)(Slider)

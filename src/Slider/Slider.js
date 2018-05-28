// @flow
import React from "react"
import "./styles.css"
import { compose } from "redux"
import withMouseHandlers from "./withMouseHandlers"
import withAligning from "./withAligning"

type Props = {
  children: HTMLDivElement[],
}

class Slider extends React.Component<Props> {
  render () {
    return (
      <div className="slider-container">
        {this.props.children}
      </div>
    )
  }
}

export default compose(
  withMouseHandlers,
)(Slider)

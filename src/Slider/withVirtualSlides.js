// @flow

import React from "react"

function withVirtualSlides (Component: any) {
  return class Slider extends React.Component<{}> {
    ref: HTMLDivElement

    componentDidMount () {
      this.slides = this.props.children.querySelectorAll(".slide")
    }

    render () {
      return (
        <Component {...this.props} />
      )
    }
  }
}

export default withVirtualSlides

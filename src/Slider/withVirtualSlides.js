// @flow

import React from "react"

function withVirtualSlides (Component: any) {
  return class Slider extends React.Component<{}> {
    ref: HTMLDivElement

    componentDidMount () {
      this.slides = this.props.children.querySelectorAll(".slide")
      console.log("this.slides")
      console.log(this.slides)
    }

    render () {
      return (
        <Component {...this.props} />
      )
    }
  }
}

export default withVirtualSlides

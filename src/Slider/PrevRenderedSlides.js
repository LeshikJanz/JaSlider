// @flow
import React, { Fragment } from "react"
import { getPrevAdditionalSlides } from "./utils";

type Props = {
  firstViewSlide: HTMLDivElement,
  slides: HTMLDivElement[],
}

function PrevRenderedSlides({ firstViewSlide, slides = [] }: Props) {
  if (slides.length) {
    console.log("slides")
    console.log(slides)
    console.log("getPrevAdditionalSlides(firstViewSlide, 4, slides)")
    console.log(getPrevAdditionalSlides(firstViewSlide, 4, slides))
  }
  return (<Fragment>PrevRenderedSlides</Fragment>)
}

export default PrevRenderedSlides

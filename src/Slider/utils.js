// @flow

export const getPrevAdditionalSlides = (currentSlide: HTMLDivElement, count: number = 4, slides) => {
  const additionalSlides = []
  const slidesCopy = new Array(...slides)
  const currentIndex = slidesCopy.indexOf(currentSlide)
  for (let i = 1; i <= count; i++) {
    if (this.slides[currentIndex - i]) {
      additionalSlides.push(slidesCopy[currentIndex - i])
    } else {
      additionalSlides.push(slidesCopy[this.slides.length - i + additionalSlides.length])
    }
  }
  return additionalSlides
}

export const getNextAdditionalSlides = (currentSlide: HTMLDivElement, count: number = 4, slides) => {
  const additionalSlides = []
  const slidesCopy = new Array(...slides)
  const currentIndex = slidesCopy.indexOf(currentSlide)
  for (let i = 1; i <= count; i++) {
    if (slidesCopy[currentIndex + i]) {
      additionalSlides.push(slidesCopy[currentIndex + i])
    } else {
      additionalSlides.push(slidesCopy.shift())
    }
  }
  return additionalSlides
}

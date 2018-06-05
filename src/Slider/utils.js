// @flow

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

export const getSlideBySlidesOffset = (currentSlide: HTMLDivElement, offsetCount, slides) => {
  const currentIndex = slides.indexOf(currentSlide)
  const newSlideIndex = currentIndex + offsetCount
  if (newSlideIndex < 0) {
    return slides[slides.length + newSlideIndex]
  }
  if (newSlideIndex >= slides.length) {
    return slides[newSlideIndex - slides.length]
  }
  return slides[newSlideIndex]
}

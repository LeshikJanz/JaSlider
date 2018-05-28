// @flow
import React, { Fragment } from "react"
import "./styles.css"
import withMouseHandlers from "./withMouseHandlers"

class Slider extends React.Component<{}> {
  render () {
    return (
      <Fragment>
        <div className="slide">
          <img draggable={false} src="https://picsum.photos/200/300?image=100" alt="" />
        </div>
        <div className="slide">
          <img draggable={false} src="https://picsum.photos/200/300?image=101" alt="" />
        </div>
        <div className="slide">
          <img draggable={false} src="https://picsum.photos/200/300?image=102" alt="" />
        </div>
        {/*<img src="https://picsum.photos/200/300?image=103" alt="" />*/}
        {/*<img src="https://picsum.photos/200/300?image=104" alt="" />*/}
        {/*<img src="https://picsum.photos/200/300?image=105" alt="" />*/}
        {/*<img src="https://picsum.photos/200/300?image=106" alt="" />*/}
      </Fragment>
    )
  }
}

export default withMouseHandlers(Slider)

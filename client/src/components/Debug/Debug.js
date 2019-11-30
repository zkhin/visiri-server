import React, { Component } from 'react'

export default class Debug extends Component {
  render() {
    const stageRef = this.props.stageRef.current
    const imageLayerRef = this.props.imageLayerRef.current
    return (
      <div>
        <div className="debug">
          <p>{`Marked Location=${this.props.stateProp.markedLocation.x}, ${this.props.stateProp.markedLocation.y}`}</p>
          {/* <p>{`position=${this.props.position.x}, ${this.props.stateProp.position.y}`}</p> */}
          <p>{`scaling=${this.props.stateProp.scale}`}</p>
          <p>{`window.innerWidth=${window.innerWidth}`}</p>
          <p>{`window.innerHeight=${window.innerHeight}`}</p>
          <p>{stageRef && `containerWidth=${document.getElementById('container').offsetWidth}`}</p>
          <p>{stageRef && `containerHeight=${document.getElementById('container').offsetHeight}`}</p>
          <p>{stageRef && `clientWidth=${imageLayerRef.getClientRect().width}`}</p>
          <p>{stageRef && `clientHeight=${stageRef.getClientRect().height}`}</p>
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'
import {Rect, Line, Text} from 'react-konva'

export default class CellRect extends Component {
  state = {
    width = 28,
    height = 28,
    fill = 'transparent',
    drag = true,
    strokeWidth = 3,
    stroke = "red",
    positionFunc = null,
  }

  render() {
    return (
      <Layer>
        <Rect
          width={this.state.width}
          height={this.state.height}
          x={this.state.containerRef.current}
          y={y}
          fill={fill}
          draggable={drag}
          strokeWidth={strokeWidth}
          stroke={stroke}
        />
      </Layer>
    )
  }
}

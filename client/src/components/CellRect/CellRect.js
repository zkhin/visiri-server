import React, { Component } from 'react'
import Konva from 'konva'
import {Rect, Line, Text} from 'react-konva'

export default class CellRect extends Component {
  static defaultProps = {
    key,
    x = 50,
    y = 50,
    width = 28,
    height = 28,
    fill = 'transparent',
    drag = true,
    strokeWidth = 3
  }

  render() {
    const {
      key,
      x,
      y,
      width,
      height,
      fill = 'transparent',
      drag = true,
      strokeWidth = 3
    } = this.props
    return (
      <>
        <Rect
          key={key}
          width={width}
          height={height}
          x={x}
          y={y}
          fill={fill}
          draggable={drag}
          strokeWidth={strokeWidth}
          stroke="black"
        />
      </>
    )
  }
}

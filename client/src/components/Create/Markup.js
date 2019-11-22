import './Markup.css'
import React, { Component } from 'react'
import Konva from 'konva'
import useImage from 'use-image'
import { Stage, Layer, Rect, Line, Text, Image } from 'react-konva'
import MarkupContext from '../../contexts/MarkupContext'

export default class Markup extends Component {
  static contextType = MarkupContext
  MainCellImage = () => {
    const [image] = useImage(this.context.image.src)
    return <Image image={image} />
  }
  render() {
    return (
      <div className="markup">
        <div className="markup-stage">
          <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              <this.MainCellImage />

              <Rect
                width={20}
                height={20}
                x={12}
                y={10}
                fill="transparent"
                draggable={true}
                strokeWidth={3}
                stroke="black"
              />
            </Layer>
          </Stage>
        </div>

      </div>
    )
  }
}

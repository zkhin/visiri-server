import React from "react"
import { Layer, Line, Rect as CellRegion } from "react-konva"
import './Regions.css'
import MarkupContext from '../../contexts/MarkupContext'

export default class Regions extends React.Component {
  static contextType = MarkupContext
  layerRef = React.useRef()

  render() {
    return (
      <Layer ref={this.layerRef}>
        {this.context.regions.map(region => {
          return (
            <React.Fragment key={region.id}>
              <CellRegion
                globalCompositeOperation="destination-out"
                x={region.point.x}
                y={region.point.y}
                fill="black"
                listening={false}
              />
              <CellRegion
                name="cellregion"
                x={region.point.x}
                y={region.point.y}
                fill="transparent"
                stroke={region.color}
                strokeWidth={3}
                width={region.regionSize || 28}
                height={region.regionSize || 28}
                onClick={() => {
                  this.context.selectRegion(region.id)
                }}
              />
            </React.Fragment>
          )
        })}
      </Layer>
    )
  }
}
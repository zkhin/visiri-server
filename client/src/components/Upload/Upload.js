import React, { Component } from 'react'
import MarkupContext from '../../contexts/MarkupContext'
import Konva from 'konva'
import { Stage, Layer, Image as MyImage } from 'react-konva'
import RegionsList from '../RegionsList/RegionsList'
import Debug from '../Debug/Debug'
import { Link } from 'react-router-dom'
import './Upload.css'
import ExperimentApiService from '../../services/experiment-api-service'

export default class Upload extends Component {

  static contextType = MarkupContext

  state = {
    error: null,
    uploaded: false,
    image: null,
    imageCanvas: {},
		position: {x: null, y: null},
		scale: null,
		debug: false,
    markedLocation: { x: null, y: null },
    touching: false,
  }
  containerRef = React.createRef()
  stageRef = React.createRef()
  imageLayerRef = React.createRef()
  regionsLayerRef = React.createRef()

	handleFinish = (e) => {
    e.preventDefault()
    if (!this.context.id) {
      this.setState({error: 'To submit, you must login and create an experiment first'})
    } else {
		ExperimentApiService.postExperimentRegions(this.context.regions.experiment_id, this.context.regions.regions)
			.then(res =>{
				this.props.onFinish()
				return res
			})
			.catch(err=>this.setState({error:err}))
    }
	}

  handleDemo = (e) => {
    e.preventDefault()
    let img = new Image()
    img.onload = () => {
      this.context.setImage(img.src, img.width, img.height)
      this.context.setRegions([])
      this.setState({
        uploaded: true,
        image: img,
        scale: 1,
      }, () => {
          this.handleImageSend(img)
      })
    }
    img.src = this.context.image.src
  }

	handleImageSend = (image) => {
      ExperimentApiService.postExperimentImage(this.context.id, image, this.state.image.width, this.state.image.height).then(res => {
        console.log(res)
      })
        .catch(err => console.log(err))

	}
  handleImport = (e) => {
    let reader = new FileReader()
    let image = e.target.files[0]
    console.log(image)
    reader.onload = (event) => {
      let img = new Image()
      img.onload = () => {
        this.context.setImage(img.src, img.width, img.height)
        this.context.setRegions([])
        this.setState({
          uploaded: true,
          image: img,
          scale: 1,
				}, ()=>
					this.handleImageSend(image)
        )
      }
      img.src = event.target.result
    }
    try {
      reader.readAsDataURL(e.target.files[0])

    } catch {
      this.setState({ error: 'No image provided' })
      return
    }

  }

  changeScale = (e, stage, factor) => {
    e.preventDefault()
    if (stage) {
      const oldScale = stage.scaleX()
      const newScale = oldScale * factor
      stage.scale({
        x: newScale,
        y: newScale
      })
      stage.batchDraw()
      this.setState({ scale: newScale })
    }
  }

  getRelativeContainerCenterPosition = (node) => {
    const transform = node.getAbsoluteTransform().copy()
    transform.invert()
		const container = this.containerRef.current
    const pos = {
      x: container.offsetWidth / 2,
      y: container.offsetHeight / 2
    }
    return transform.point(pos)
  }

  getRelativePointerPosition = (node) => {
    const transform = node.getAbsoluteTransform().copy()
    transform.invert()
    const pos = node.getStage().getPointerPosition()
    return transform.point(pos)
  }

  findCellOnStage = (e, stage = this.stageRef.current) => {
    let regionId = e.target.id.split('-')[1]
    let region = this.context.regions.regions.data[regionId - 1]
    let regionPoint = region.point
    let scale = this.context.regionSize / region.regionSize
    const newPosition = {
      x: this.containerRef.current.offsetWidth / 2 - regionPoint.x * scale ,
      y: this.containerRef.current.offsetHeight / 2 - regionPoint.y*scale
    }
    stage.tween = new Konva.Tween({
      node: stage,
      duration: .25,
      x: newPosition.x,
      y: newPosition.y,
      easing: Konva.Easings.EaseIn,
      scaleX: scale,
      scaleY: scale,
    })
    // stage.scale({x: scale, y: scale})
    // stage.position(newPosition)
    // stage.batchDraw()
    this.setState({
      ...this.state,
      position: newPosition,
      scale: scale,
    }, () => stage.tween.play())
  }


  pinchZoomWheelEvent(stage) {
  if (stage) {
    stage.getContent().addEventListener('wheel', (wheelEvent) => {
      if (this.state.uploaded) {
        wheelEvent.preventDefault()
        wheelEvent.stopPropagation()

        const oldScale = stage.scaleX()

        const pointer = stage.getPointerPosition()
        const startPos = {
          x: pointer.x / oldScale - stage.x() / oldScale,
          y: pointer.y / oldScale - stage.y() / oldScale,
        }

        const deltaYBounded = !(wheelEvent.deltaY % 1) ?
          Math.abs(Math.min(-10, Math.max(10, wheelEvent.deltaY))) :
          Math.abs(wheelEvent.deltaY)
        const scaleBy = .10 + deltaYBounded / 90
        const newScale = wheelEvent.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy
        stage.scale({ x: newScale, y: newScale })

        const newPosition = {
          x: (pointer.x / newScale - startPos.x) * newScale,
          y: (pointer.y / newScale - startPos.y) * newScale,
        }
        stage.position(newPosition)
        stage.batchDraw()
        this.setState({
          ...this.state,
          position: newPosition,
          scale: newScale,
        })
      }

    })
    }
  }

  getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2))
  }

  clientPointerRelativeToStage = (clientX, clientY, stage) => {
    return {
      x: clientX - stage.getContent().offsetLeft,
      y: clientY - stage.getContent().offsetTop,
    }
  }

  dblClickTap = (stage) => {
    if (stage) {
      stage.addEventListener('dblclick dbltap', (evt) => {
        if (!this.state.touching) {
          this.createCellRegion(evt)
        }
      }, false)
    }
  }

  pinchZoomTouchEvent = (stage) => {
    if (stage) {
      let lastDist
      let point
      stage.getContent().addEventListener('touchmove', (evt) => {
        const t1 = evt.touches[0]
        const t2 = evt.touches[1]

        if (t1 && t2) {
          evt.preventDefault()
          evt.stopPropagation()
          this.setState({touching: true})
          const oldScale = stage.scaleX()

          const dist = this.getDistance(
            { x: t1.clientX, y: t1.clientY },
            { x: t2.clientX, y: t2.clientY }
          )
          if (!lastDist) lastDist = dist
          const delta = dist - lastDist

          const px = (t1.clientX + t2.clientX) / 2
          const py = (t1.clientY + t2.clientY) / 2
          const pointer = point || this.clientPointerRelativeToStage(px, py, stage)
          if (!point) point = pointer

          const startPos = {
            x: pointer.x / oldScale - stage.x() / oldScale,
            y: pointer.y / oldScale - stage.y() / oldScale,
          }

          const scaleBy = 1.01 + Math.abs(delta) / 100
          const newScale = delta < 0 ? oldScale / scaleBy : oldScale * scaleBy
          stage.scale({ x: newScale, y: newScale })

          const newPosition = {
            x: (pointer.x / newScale - startPos.x) * newScale,
            y: (pointer.y / newScale - startPos.y) * newScale,
          }

          stage.position(newPosition)
          stage.batchDraw()
          lastDist = dist
          this.setState({
            ...this.state,
            position: newPosition,
            scale: newScale,
          })
          setTimeout(()=>this.setState({touching: false}), 2000)

        }
      }, false)

      stage.getContent().addEventListener('touchend', () => {
        lastDist = 0
        point = undefined
      }, false)
    }
  }

  updateScaleBoxOffset = () => {
    this.setState({ scaleBoxOffset: this.containerRef.current.offsetHeight / 2 })
  }

  outsideImageBounds = (point) => {
    if (point.x < 0 || point.y < 0 || point.x > this.context.image.width || point.y > this.context.image.height) {
      return true
    } else {
      return false
    }
  }

  createCellRegion = (e) => {
    if (this.state.uploaded) {
      let point = null
      if (e.target.name === 'stage') {
        point = this.getRelativePointerPosition(e.target.getStage())
      }

      let region = {
        id: this.context.regions.regions.data.length + 1,
        color: Konva.Util.getRandomColor(),
        regionSize: this.context.regionSize / this.state.scale,
      }
      if (point) {
        region.point = [point]
      } else {
        point = this.getRelativeContainerCenterPosition(this.stageRef.current)
        region.point = point
      }
      if (this.outsideImageBounds(region.point)) {
				point = null
        return
      } else {
        this.setState({
          markedLocation: {
            x: region.point.x * this.state.scale,
            y: region.point.y * this.state.scale,
          }
        })
        this.context.setRegions(this.context.regions.regions.data.concat(region))
        this.renderCellRegion(region)
      }

    }

  }

  updateStagePosition = (e) => {
    this.setState({ position: e.target.position() })
  }

  componentDidMount() {
    this.pinchZoomWheelEvent(this.stageRef.current)
    this.pinchZoomTouchEvent(this.stageRef.current)
    this.dblClickTap(this.stageRef.current)
  }

  renderCellRegion = (region) => {
    const layer = this.regionsLayerRef.current
    let box1 = new Konva.RegularPolygon({
      name: `region${region.id}`,
      sides: 4,
      radius: region.regionSize / 2,
      rotation: 45,
      x: region.point.x,
      y: region.point.y,
      // x: region.point.x - region.regionSize / this.state.scale / 2,
      // y: (region.point.y - region.regionSize / this.state.scale / 2),
      fill: "transparent",
      strokeWidth: 5 / this.state.scale,
      stroke: region.color,
    })
    let box2 = new Konva.RegularPolygon({
      name: `region${region.id}-2`,
      sides: 4,
      // radius: (region.regionSize / this.state.scale) / 2,
      radius: region.regionSize / 2,
      rotation: 45,
      x: region.point.x,
      y: region.point.y,
      fill: "transparent",
      strokeWidth: 2 / this.state.scale,
      stroke: "white",
    })
    layer.add(box1)
    layer.add(box2)
    box1.tween = new Konva.Tween({
      node: box1,
      radius: 1.2 * (region.regionSize / 2),
      easing: Konva.Easings.EaseInOut,
      duration: .25,
      // opacity: .7,
      onFinish: () => box1.tween.reverse()

    })
    box2.tween = new Konva.Tween({
      node: box2,
      scaleX: 1,
      scaleY: 1,
      easing: Konva.Easings.EaseInOut,
      duration: .2,
      stroke: "rgb(203, 36, 49, 0.9)",
      strokeWidth: 4 / this.state.scale,
      opacity: .8,
      onFinish: () => box2.tween.reverse()
    })
    box1.draw()
    box2.draw()
    layer.batchDraw()
    box1.tween.play()
    box2.tween.play()

  }


  render() {
    return (
      <>
        {!this.state.image &&
          <>
          <h2>Upload your image</h2>
          <h5>Or use <a href="#" onClick={this.handleDemo}>Sample Image</a></h5>
          </>
          }
        <div className="upload">
          <div id="container" ref={this.containerRef}>
            {this.state.debug === true &&
              <Debug className="debug" stateProp={this.state} imageLayerRef={this.imageLayerRef} stageRef={this.stageRef} />
            }
            {!this.state.uploaded &&
              <form
              id="imageform"
              className="uploadform">
                <div className="uploadform">
                  <input className="menu file" type="file" id="image" name="image" onChange={this.handleImport} />
                </div>
              </form>
            }
            {this.state.uploaded &&
              <div className="scaleBox">
              </div>

            }
            <Stage
              name="stage"
              container="container"
              ref={this.stageRef}
              className="canvas"
              onDragEnd={this.updateStagePosition}
              draggable
              width={window.innerWidth}
              height={window.innerHeight}
            >

              <Layer ref={this.imageLayerRef}>
                <MyImage image={this.state.image} />
              </Layer>
              <Layer ref={this.regionsLayerRef}>
              </Layer>
            </Stage>

          </div>
          <button className="menu" onClick={this.createCellRegion}>Mark Cell</button>
          {/* <button className="menu" onClick={()=>{this.setState({debug: !this.state.debug})}}>Debug</button> */}

          {this.context.regions.regions.data.length >= 0 &&
            this.state.uploaded &&
            <>
            <RegionsList onClick={this.findCellOnStage} regions={this.context.regions.regions.data} />
              <button
                onClick={this.handleFinish}
                className="menu finish tooltip">
                Finish Calibration
                {typeof this.state.error == 'string' &&
                <span className="errortext">{this.state.error}</span>
                }
              </button>
            </>
          }
        </div>
      </>
    )
  }
}

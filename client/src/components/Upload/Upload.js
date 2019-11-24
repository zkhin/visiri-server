import React, { Component } from 'react'
import MarkupContext from '../../contexts/MarkupContext'
import Konva from 'konva'
import { Stage, Layer, Image as MyImage } from 'react-konva'
import Regions from '../Regions/Regions'
import Portal from '../Portal/Portal'
import { Link } from 'react-router-dom'
import './Upload.css'

export default class Upload extends Component {

  static contextType = MarkupContext

  state = {
    error: null,
    uploaded: false,
    image: null,
    imageCanvas: {},
		position: {x: null, y: null},
		scale: null,
		debug: true,
    markedLocation: {x: null, y: null},
  }
  containerRef = React.createRef()
  stageRef = React.createRef()
	imageLayerRef = React.createRef()

  handleImport = (e) => {
    let reader = new FileReader()
    reader.onload = (event) => {
      let img = new Image()
      img.onload = () => {
        this.context.setImageSrc(img.src)
        this.setState({
          uploaded: true,
          image: img,
          scale: 1,
          }
        )
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(e.target.files[0])
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
      stage.batchDraw();
      this.setState({ scale: newScale })
    }
  }

  getRelativeContainerCenterPosition = (node) => {
    const transform = node.getAbsoluteTransform().copy();
    transform.invert();
    const pos = {
      x: this.containerRef.current.offsetWidth / 2,
      y: this.containerRef.current.offsetHeight / 2
    }
    return transform.point(pos);
  }

  getRelativePointerPosition = (node) => {
    // the function will return pointer position relative to the passed node
    const transform = node.getAbsoluteTransform().copy();
    // to detect relative position we need to invert transform
    transform.invert();

    // get pointer (say mouse or touch) position
    const pos = node.getStage().getPointerPosition();

    //find relative point
    return transform.point(pos);
  }


  pinchZoomWheelEvent(stage) {
  if (stage) {
    stage.getContent().addEventListener('wheel', (wheelEvent) => {
      wheelEvent.preventDefault();
      const oldScale = stage.scaleX();

      const pointer = stage.getPointerPosition();
      const startPos = {
        x: pointer.x / oldScale - stage.x() / oldScale,
        y: pointer.y / oldScale - stage.y() / oldScale,
      };

			const deltaYBounded = !(wheelEvent.deltaY % 1) ?
				Math.abs(Math.min(-10, Math.max(10, wheelEvent.deltaY))) :
				Math.abs(wheelEvent.deltaY);
      const scaleBy = .10 + deltaYBounded / 95;
      const newScale = wheelEvent.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
      stage.scale({ x: newScale, y: newScale });

      const newPosition = {
        x: (pointer.x / newScale - startPos.x) * newScale,
        y: (pointer.y / newScale - startPos.y) * newScale,
      };
      stage.position(newPosition);
      stage.batchDraw();
      this.setState({
        ...this.state,
        position: newPosition,
        scale: newScale,
      })
    });
    }
  }



  getDistance = (p1, p2) => {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2) + Math.pow((p2.y - p1.y), 2));
  }

  clientPointerRelativeToStage = (clientX, clientY, stage) => {
    return {
      x: clientX - stage.getContent().offsetLeft,
      y: clientY - stage.getContent().offsetTop,
    }
  }

  pinchZoomTouchEvent = (stage) => {
    if (stage) {
      let lastDist
      let point
      stage.getContent().addEventListener('touchmove', (evt) => {
        const t1 = evt.touches[0];
        const t2 = evt.touches[1];

        if (t1 && t2) {
          evt.preventDefault();
          evt.stopPropagation();
          const oldScale = stage.scaleX();

          const dist = this.getDistance(
            { x: t1.clientX, y: t1.clientY },
            { x: t2.clientX, y: t2.clientY }
          );
          if (!lastDist) lastDist = dist;
          const delta = dist - lastDist;

          const px = (t1.clientX + t2.clientX) / 2;
          const py = (t1.clientY + t2.clientY) / 2;
          const pointer = point || this.clientPointerRelativeToStage(px, py, stage);
          if (!point) point = pointer;

          const startPos = {
            x: pointer.x / oldScale - stage.x() / oldScale,
            y: pointer.y / oldScale - stage.y() / oldScale,
          };

          const scaleBy = 1.01 + Math.abs(delta) / 100;
          const newScale = delta < 0 ? oldScale / scaleBy : oldScale * scaleBy;
          stage.scale({ x: newScale, y: newScale });

          const newPosition = {
            x: (pointer.x / newScale - startPos.x) * newScale,
            y: (pointer.y / newScale - startPos.y) * newScale,
          };

          stage.position(newPosition);
          stage.batchDraw();
          lastDist = dist;
          this.setState({
            ...this.state,
            position: newPosition,
            scale: newScale,
          })
        }
      }, false);

      stage.getContent().addEventListener('touchend', () => {
        lastDist = 0;
        point = undefined;
      }, false);
    }
  }

  createCellRegion = (e) => {
		let point = null
		if (e.target.name === 'stage') {
			point = this.getRelativePointerPosition(e.target.getStage());
		}
		let region = {
				id: this.context.regions.length++,
				color: Konva.Util.getRandomColor(),
				regionSize: this.context.regionSize,
		}
		if (point){
				region.point = [point]
    } else {
      point = this.getRelativeContainerCenterPosition(this.stageRef.current)
      region.point = point
      console.log(region.point)
    }
    this.setState({
      markedLocation: {
        x: region.point.x * this.state.scale,
        y: region.point.y * this.state.scale,
      }
    })
    this.context.setRegions(region);
  }

  updateStagePosition = (e) => {
    this.setState({ position: e.target.position() })
  }

  componentDidMount() {
    this.pinchZoomWheelEvent(this.stageRef.current)
    this.pinchZoomTouchEvent(this.stageRef.current)
  }



  render() {
    return (
      <>
        <h2>Upload your image</h2>
        <div className="upload">
          {/* <button onClick={(e)=>this.changeScale(e, this.stageRef.current, .8)}> - </button>
          <button onClick={(e)=>this.changeScale(e, this.stageRef.current, 1.2)}> + </button> */}

          <div id="container" ref={this.containerRef}>
            <Stage
							name="stage"
              ref={this.stageRef}
              className="canvas"
              onDragEnd={this.updateStagePosition}
              draggable
							width={window.innerWidth}
							height={window.innerWidth}
						>
							{
							/*<Portal>
                {this.state.uploaded && <div className="scaleBox"></div>}
							</Portal>*/
							}
              <Layer ref={this.imageLayerRef}>
								<MyImage image={this.state.image} />
              </Layer>
							{this.context.regions.length > 0 && <Regions />}
            </Stage>


            {/* <Stage ref={this.stageRef}
              scaleX={this.state.scale}
              scaleY={this.state.scale}
              width={this.state.image.width * this.state.scale}
              height={this.state.image.width * this.state.scale}>
              <Layer>
                <MyImage image={this.state.image}></MyImage>
              </Layer>
            </Stage>: null} */}
          </div>
					{this.state.debug === true &&
            <div className="debug">
            <p>{`Marked Location=${this.state.markedLocation.x}, ${this.state.markedLocation.y}`}</p>
							<p>{`position=${this.state.position.x}, ${this.state.position.y}`}</p>
							<p>{`scaling=${this.state.scale}`}</p>
							<p>{`window.innerWidth=${window.innerWidth}`}</p>
							<p>{`window.innerHeight=${window.innerHeight}`}</p>
            <p>{this.stageRef.current && `containerWidth=${document.getElementById('container').offsetWidth}`}</p>
            <p>{this.stageRef.current && `containerHeight=${document.getElementById('container').offsetHeight}`}</p>
              <p>{this.stageRef.current && `clientWidth=${this.imageLayerRef.current.getClientRect().width}`}</p>
            <p>{this.stageRef.current && `clientHeight=${this.stageRef.current.getClientRect().height}`}</p>
						</div>
					}
					<button className="markcell" onClick={this.createCellRegion}>Mark Cell</button>
          <form className="uploadform">
            <label htmlFor="imageLoader">{this.state.uploaded? `Choose another file`: `Image File:`}</label> <br />
            <input type="file" id="imageLoader" name="imageLoader" onChange={this.handleImport}/>
            <Link to='/create'><button>create</button></Link>
          </form>
        </div>
      </>
    )
  }
}

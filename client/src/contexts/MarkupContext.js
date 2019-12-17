import React, { Component } from 'react'

const MarkupContext = React.createContext()

export default MarkupContext

const defaultImage = document.createElement('img')
let random = Math.ceil(Math.random()*2)
defaultImage.src = (random === 1? '/default.jpeg': '/default2.jpeg')

export class MarkupContextProvider extends Component {
  state = {
    image: {
      src: defaultImage.src,
      width: null,
      height: null,
      magnification: null,
      demo: false,
    },
    setImageSrc: this.setImageSrc,
    id: null,
    experiment_type: null,
    celltype: null,
    cellDiameter: null,
    scaling: null,
    regions: {
      id: null,
      experiment_id: null,
      regions: {
        data: [],
      }
    },
    selectedRegionId: null,
    selectRegion: this.selectRegion,
    regionSize: 56,
    setExperiment: this.setExperiment,
  }

  getRegionById = (regionId) => {
    return this.state.regions.find(region => region.id === regionId)
  }

  deleteRegionById = (id) => {
    let toRemove = this.getRegionById(id)
    this.setState({
      regions: this.state.regions.filter(region => region !== toRemove)
    })
  }

  selectRegion = (selectedRegionId) => this.setState({selectedRegionId})

  setImage = (src, width, height) => {
    this.setState({
      image: {
        src,
        width,
        height
      }
    })
  }

  setExperiment = (id, celltype, experiment_type='Calibration') => {
    this.setState({
			...this.state,
      id: id,
      celltype,
      experiment_type,
      regions: {
        experiment_id: id,
        regions: {
          data: []
        }
      }
    })
  }

  setRegionSize = (diam) => {

    this.setState({
      regionSize: diam
    })
  }

  setRegions = (newData) => {
    this.setState({
			...this.state,
      regions: {
				...this.state.regions,
        regions: {
          data: newData,
        }
      }
    })
  }


  render() {
    const value = {
      image: this.state.image,
      setImage: this.setImage,
      setExperiment: this.setExperiment,
      id: this.state.id,
      experiment_type: this.state.experiment_type,
      celltype: this.state.celltype,
      cellDiameter: this.state.cellDiameter,
      scaling: this.state.scaling,
      regions: this.state.regions,
      selectedRegionId: this.state.selectedRegionId,
      selectRegion: this.selectRegion,
      regionSize: this.state.regionSize,
      setRegionSize: this.setRegionSize,
      setRegions: this.setRegions,
    }
    return (
      <MarkupContext.Provider value={value}>
        {this.props.children}
      </MarkupContext.Provider>
    )
  }
}

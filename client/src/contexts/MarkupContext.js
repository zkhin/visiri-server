import React, { Component } from 'react'
import ExperimentApiService from '../services/experiment-api-service'

const MarkupContext = React.createContext({
  image: {
    src: null,
    width: null,
    height: null,
    magnification: null,
  },
  experimentName: null,
  experimentType: 'calibration',
  cellType: null,
  cellDiameter: null,
  scaling: null,
  // setImage: (dataUrl) => { },
  // setExperiment: (name, type) => { },
  // setDiameter: () => { },
})

export default MarkupContext

const defaultImage = document.createElement('img')
defaultImage.src = '/test1.jpeg'

export class MarkupContextProvider extends Component {
  state = {
    image: {
      src: defaultImage.src,
      width: null,
      height: null,
      magnification: null,
    },
    setImageSrc: this.setImageSrc,
    id: null,
    experiment_type: null,
    celltype: null,
    cellDiameter: null,
    scaling: null,
    regions: [],
    selectedRegionId: null,
    selectRegion: this.selectRegion,
    regionSize: 56,
    setExperiment: this.setExperiment,
    postImage: this.postImage,
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
      id,
      celltype,
      experiment_type,
    })
  }

  setRegionSize = (diam) => {

    this.setState({
      regionSize: diam
    })
  }

  setRegions = (newRegions) => {
    this.setState({regions: newRegions})
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
      postImage: this.postImage,
    }
    return (
      <MarkupContext.Provider value={value}>
        {this.props.children}
      </MarkupContext.Provider>
    )
  }
}

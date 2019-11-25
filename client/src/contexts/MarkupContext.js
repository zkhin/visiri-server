import React, { Component } from 'react'

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
    experimentName: null,
    experimentType: 'calibration',
    cellType: null,
    cellDiameter: null,
    scaling: null,
    // regions: [
    //   {
    //     id: null,
    //     point: {x: null, y: null},
    //     color: 'black',
    //     regionSize: 28,
    //   }
    // ],
    regions: [],
    selectedRegionId: null,
    selectRegion: this.selectRegion,
    regionSize: 56,
    setRegionSize: this.setRegionSize,
    // setImage: () => {},
    // setExperiment: (name, type) => { },
    // setDiameter: () => { },
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

  setImageSrc = (src) => {
    this.setState({
      image: {
        src: src
      }
    })
  }

  setExperiment = (name, cellType, type='calibration') => {
    this.setState({
      experimentName: name,
      experimentType: type,
      cellType: cellType,
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
      setImageSrc: this.setImageSrc,
      experimentName: this.state.experimentName,
      experimentType: this.state.experimentType,
      cellType: this.state.cellType,
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

import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MarkupContext from '../../contexts/MarkupContext'
import ExperimentApiService from '../../services/experiment-api-service'
import './Experiments.css'
import RegionsList from '../RegionsList/RegionsList'
import ExperimentImages from './ExperimentImages'

export default class Experiments extends Component {
  static contextType = MarkupContext
  // static defaultProps = {
  //   onCreateSuccess: () => {},
  // }
  state = {
    experiments: null,
    images: null,
    regions: null,
    creating: false,
    experimentsLoaded: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    let newExperiment = {
      experiment_type: e.target.experiment_type.value,
      celltype: e.target.celltype.value,
    }
    ExperimentApiService.postExperiment(newExperiment).then(res => {
      this.context.setExperiment(res.id, res.celltype, res.experiment_type)
    }).then(() => this.props.onCreateSuccess())
  }

  async fetchExperiments() {
    let experiments = await ExperimentApiService.getExperiments()
    this.setState({
      experiments: experiments,
      experimentsLoaded: true,
    })

    // let images = this.state.experiments.map(async (exp, i) => {
    //   let imgs = await ExperimentApiService.getExperimentImages(exp.id)
    //   return imgs
    // })
    // let imgs = Promise.all(images)
    // imgs.then(img => this.setState({
    //   ...this.state,
    //   images: img,
    //   imagesLoaded: true,
    // }))

    // let regions = this.state.experiments.map(async (exp, i) => {
    //   let regs = await ExperimentApiService.getExperimentRegions(exp.id)
    //   return regs
    // })
    // let regs = Promise.all(regions)
    // regs.then(reg => this.setState({
    //   ...this.state,
    //   regions: reg,
    //   regionsLoaded: true,
    // }))



    // let expWithImagesRegions = await this.state.experiments.map(async exp => {
    //   return await this.fetchExperimentRegions(exp.id)
    // })
    // await this.setState({
    //   ...this.state,
    //   experiments: expWithImagesRegions,
    //   regionsLoaded: true,
    // })

  }






  componentDidMount() {
    this.fetchExperiments()
  }

  renderExperiments() {
    return (
      <>
        {this.state.experimentsLoaded &&
          this.state.experiments.map((experiment, i) =>
              <div key={experiment.id} className="experiment">
                <ul>
                  <li>
                    {experiment.celltype}
                  </li>
                  <li>
                    {experiment.experiment_type}
                  </li>
                  <li>
                    {experiment.date_created}
                  </li>
                </ul>
                <div className="review">
                  {
                  <ExperimentImages experimentId={experiment.id} />
                  }
                  {
                  <RegionsList experimentId={experiment.id} />
                  }
                </div>
              </div>
          )
        }
      </>
    )
  }

  renderRegions(i) {
    if (this.state.regions[i].length > 0) {
      return (
        <RegionsList
          regions={this.state.regions[i][0].regions.data}
          onClick={this.displayRegion}
        />
      )
    }
  }

  renderImages(i) {
    if (this.state.images[i].length > 0) {
      return (
          <img className="expimage"
            src={this.state.images[i][0].image_url}>
          </img>
      )
    }
  }


  render() {
    return (
      <>
        <button className="menu button" onClick={()=>this.setState({ creating: !this.state.creating })}>Create New Calibration Data</button>
        {this.state.creating &&
          <form id="createxp" onSubmit={this.handleSubmit} className="createxp menu">
            <label>Cell Type:
              <input name="celltype" type="text"></input>
            </label>
            <label>Experiment Type:
              <input name="experiment_type" type="text" placeholder="Calibration"></input>
            </label>
            <button className="button menu" type="submit">Submit</button>
          </form>
        }
        {this.state.experiments
          ? this.renderExperiments()
          : "You have not created any experiments"
        }
    </>
    )
  }
}

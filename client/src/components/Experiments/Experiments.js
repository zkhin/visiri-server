import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import MarkupContext from '../../contexts/MarkupContext'
import ExperimentApiService from '../../services/experiment-api-service'
import './Experiments.css'
import RegionsList from '../RegionsList/RegionsList'

export default class Experiments extends Component {
  static contextType = MarkupContext
  state = {
    experiments: [],
  }

  fetchExperiments() {
    ExperimentApiService.getExperiments().then(experiments => {
      console.log(experiments)
      let allExperiments = []
      experiments.map(experiment => {
        let exp = { ...experiment }
        let images = this.fetchExperimentImages(exp.id)
        let regions = this.fetchExperimentRegions(exp.id)
        Promise.all([images, regions]).then(([images, regions]) => {
          exp.images = images
          exp.regions = regions
          allExperiments.push(exp)
          this.setState({
            experiments: allExperiments
          })
        })
      })

    })
  }
  fetchExperimentImages(experimentId) {
    return ExperimentApiService.getExperimentImages(experimentId)
  }

  fetchExperimentRegions(experimentId) {
    return ExperimentApiService.getExperimentRegions(experimentId)
  }

  componentDidMount() {
    this.fetchExperiments()
  }

  renderExperiments() {
    return (
    <>
      {
        this.state.experiments.map(experiment =>
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
              <img className="expimage" src={experiment.images[0].image_url}></img>
              <RegionsList regions={experiment.regions} onClick={this.displayRegion} />
            </div>

          </div>)
        }
    </>
    )
  }
  render() {
    return (
      <>
        <Link className="menu button" to="/upload">Create New Calibration Data</Link>
        {this.state.experiments.length > 0
          ? this.renderExperiments()
          : "You have not created any experiments"
        }
    </>
    )
  }
}

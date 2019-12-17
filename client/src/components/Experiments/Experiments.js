import React, { Component } from 'react'
import { NiceDate } from '../Utils/Utils'
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
               <div className="review">

                  <ExperimentImages experimentId={experiment.id} />
                <content className="expinfo">
                  <p>
                    {experiment.celltype}
                  </p>
                  <p>
                    {experiment.experiment_type}
                  </p>
                  <p>
                    {NiceDate({ date: Date.parse(experiment.date_created) })}
                  </p>
                </content>


                </div>
              <RegionsList experimentId={experiment.id} />

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
            <button className="menu" type="submit">Submit</button>
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

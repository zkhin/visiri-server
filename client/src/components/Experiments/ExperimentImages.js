import React, { Component } from 'react'
import MarkupContext from '../../contexts/MarkupContext'
import ExperimentApiService from '../../services/experiment-api-service'

export default class ExperimentImages extends Component {
  static contextType = MarkupContext
  static defaultProps = {
    experimentId: null,
  }

  state = {
    experimentId: this.props.experimentId,
    images: null,
    imagesLoaded: false,
  }

  async componentDidMount() {
    if (!this.state.images) {
      let images = await this.fetchExperimentImages(this.state.experimentId)
      this.setState({
        images,
        imagesLoaded: true
      })
    }
  }

  async fetchExperimentImages(experimentId) {
    try {
      return await ExperimentApiService.getExperimentImages(experimentId)
    } catch (err) {
      this.setState({ error: err })
    }
  }
  render() {
    return (
      <>
        {this.state.imagesLoaded &&
          this.state.images &&
          this.state.images.length > 0 &&
          <img className="expimage"
            src={this.state.images[0].image_url}>
          </img>
        }

      </>
    )
  }
}

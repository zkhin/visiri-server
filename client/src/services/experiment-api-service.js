import config from '../config'
import TokenService from './token-service'

const ExperimentApiService = {
  getExperiments() {
    return fetch(`${config.API_ENDPOINT}/experiments`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  getExperiment(experimentId) {
    return fetch(`${config.API_ENDPOINT}/experiments/${experimentId}`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  getExperimentImages(experimentId) {
    return fetch(`${config.API_ENDPOINT}/experiments/${experimentId}/images`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  getExperimentRegions(experimentId) {
    return fetch(`${config.API_ENDPOINT}/experiments/${experimentId}/regions`, {
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  postExperiment(experiment) {
    return fetch(`${config.API_ENDPOINT}/experiments`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        celltype: experiment.celltype,
        experiment_type: experiment.experiment_type,
      })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  },

  postExperimentImage(experimentId, image, image_width, image_height) {
    let formdata = new FormData()
    formdata.append('image', image)
    formdata.append('image_width', image_width)
    formdata.append('image_height', image_height)

    return fetch(`${config.API_ENDPOINT}/experiments/${experimentId}/images`, {
      method: 'POST',
      headers: {
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: formdata
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
        )
  },

  postExperimentRegions(experimentId, regions) {
		return fetch(`${config.API_ENDPOINT}/experiments/${experimentId}/regions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        experiment_id: experimentId,
        regions,
      })
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }
}

export default ExperimentApiService

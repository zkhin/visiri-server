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

			})
		})
	}
  postRegions(experimentId, regions) {
    return fetch(`${config.API_ENDPOINT}/regions`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`
      },
      body: JSON.stringify({
        experiment_id: experimentId,
        regions,
      }),
    })
      .then(res =>
        (!res.ok)
          ? res.json().then(e => Promise.reject(e))
          : res.json()
      )
  }
}

export default ExperimentApiService

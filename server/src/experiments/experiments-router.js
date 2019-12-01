const express = require('express')
const ExperimentsService = require('./experiments-service')
const { requireAuth } = require('../middleware/jwt-auth')

const experimentsRouter = express.Router()

experimentsRouter.route('/')
  .get((req, res, next) => {
    ExperimentsService.getAllUserExperiments(req.app.get('db'), req.user)
      .then(experiments => {
        res.json(ExperimentsService.serializeExperiments(experiments))
      })
      .catch(next)
  })

experimentsRouter.route('/:experiment_id')
  .all(requireAuth)
  .all(checkExperimentExists)
  .get((req, res) => {
    res.json(ExperimentsService.serializeExperiment(res.experiment))
  })

experimentsRouter.route('/:experiment_id/regions')
  .all(requireAuth)
  .all(checkExperimentExists)
  .get((req, res, next) => {
    ExperimentsService.getRegionsForExperiment(
      req.app.get('db'),
      req.params.experiment_id
    )
      .then(regions => {
        res.json(ExperimentsService.serializeExperimentRegions(regions))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkExperimentExists(req, res, next) {
  try {
    const experiment = await ExperimentsService.getById(
      req.app.get('db'),
      req.params.experiment_id
    )

    if (!experiment)
      return res.status(404).json({
        error: `Experiment doesn't exist`
      })

    res.experiment = experiment
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = experimentsRouter

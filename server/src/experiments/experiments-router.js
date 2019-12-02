const express = require('express')
const ExperimentsService = require('./experiments-service')
const RegionsService = require('../regions/regions-service')
const ImagesService = require('../images/images-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()

const experimentsRouter = express.Router()

experimentsRouter.route('/')
  .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    let { celltype, experiment_type } = req.body
    let newExperiment = {
      celltype,
      experiment_type,
      user_id: req.user.user_id
    }
    ExperimentsService.insertExperiment(
      req.app.get('db'),
      req.user.user_name,
      newExperiment
    )
  })
  .get((req, res, next) => {
    ExperimentsService.getAllUserExperiments(req.app.get('db'), req.user.user_name)
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
    RegionsService.getRegionsForExperiment(
      req.app.get('db'),
      req.params.experiment_id
    )
      .then(regions => {
        res.json(RegionsService.serializeExperimentRegions(regions))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkExperimentExists(req, res, next) {
  try {
    const experiment = await ExperimentsService.getByUserAndId(
      req.app.get('db'),
      req.user.user_name,
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

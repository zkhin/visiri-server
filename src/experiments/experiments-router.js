const express = require('express')
const ExperimentsService = require('./experiments-service')
const RegionsService = require('../regions/regions-service')
const ImagesService = require('../images/images-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { upload } = require('../images/images-router')
const jsonBodyParser = express.json()

const experimentsRouter = express.Router()

experimentsRouter.route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    ExperimentsService.getAllexperiments(req.app.get('db'))
      .then(experiments => {
        experiments = experiments.filter(experiment => experiment.user_id === req.user.id)
        return experiments
      })
      .then(data => {
        res.status(200)
        res.json(ExperimentsService.serializeExperiments(data))
    })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    let { celltype, experiment_type } = req.body
    let newExperiment = {
      celltype,
      experiment_type,
      user_id: req.user.id
    }
    ExperimentsService.insertExperiment(
      req.app.get('db'),
      req.user.user_name,
      newExperiment
    )
      .then(experiment => {
        res.status(201)
          .json(ExperimentsService.serializeExperiment(experiment))
      })
      .catch(next)
  })


experimentsRouter.route('/:experiment_id')
  .all(requireAuth)
  .all(checkExperimentExists)
  .get((req, res, next) => {
    ExperimentsService.getByUserAndId(req.app.get('db'), req.user.user_name, req.params.experiment_id)
      .then(experiment => {
        if (!experiment) {
          res.status(404)
          return res.json('Experiment not found')
        }
        else {
          res.status(200)
          res.json(ExperimentsService.serializeExperiment(experiment))
        }

      })
      .catch(next)
  })

experimentsRouter.route('/:experiment_id/images')
  .all(requireAuth)
  .all(checkExperimentExists)
  .get((req, res, next) => {
    ImagesService.getImagesByExperiment(
      req.app.get('db'),
      req.params.experiment_id
    )
      .then(images => {

          let imagesData = images.map(image => ImagesService.serializeImage(image))
          res.status(200)
          res.json(imagesData)

      })
      .catch(next)
  })
  .post(upload.single('image'), (req, res, next) => {
    if (!req.file) {
      res.status(500)
      return next(err)
    }
    let filePath = `${req.protocol}s://${req.hostname}/api/images/${req.file.filename}`
    let newImage = {
      image_url: filePath,
      image_width: parseInt(req.body.image_width),
      image_height: parseInt(req.body.image_height),
      experiment_id: parseInt(req.params.experiment_id),
    }
    ImagesService.insertImage(
      req.app.get('db'),
      newImage,
    )
      .then(image => {
        res.status(201)
        res.json(ImagesService.serializeImage(image))
      })
    .catch(next)

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
        res.status(200)
        res.json(RegionsService.serializeExperimentRegions(regions))
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    if (!req.body) {
      res.status(500)
      return next(err)
    }
    let newRegions = {
      experiment_id: req.params.experiment_id,
      regions: JSON.stringify(req.body.regions),
    }
    RegionsService.insertRegions(req.app.get('db'), newRegions)
      .then(region => {
        res.status(201)
        res.json(RegionsService.serializeExperimentRegion(region))
      }
    )
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

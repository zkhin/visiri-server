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
    ExperimentsService.getAllUserExperiments(req.app.get('db'), req.user.user_name)
      .then(experiments => {
        res.json(ExperimentsService.serializeExperiments(experiments))
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
      .then(experiments => {
        res.status(200)
        res.json(ExperimentsService.serializeExperiments(experiments))
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
        res.json(imagesData)
      })
      .catch(next)
  })
  .post(jsonBodyParser, upload.single('image'), (req, res, next) => {
    if (!req.file) {
      res.status(500)
      return next(err)
    }
    let filePath = `${req.protocol}://${req.hostname}:8000/api/images/${req.file.filename}`
    let newImage = {
      image_url: filePath,
      image_width: req.body.image_width,
      image_height: req.body.image_height,
      experiment_id: req.params.experiment_id,
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
        res.json(RegionsService.serializeExperimentRegions(regions))
      })
      .catch(next)
  })
  .post((req, res, next) => {
    if (!req.body) {
      res.status(500)
      return next(err)
    }
    console.log(req.body.regions)
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

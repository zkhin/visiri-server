const xss = require('xss')
const Treeize = require('treeize')

const ExperimentsService = {
  getAllExperiments(db) {
    return db
      .from('experiments AS exp')
      .select(
        'exp.id',
        'exp.celltype',
        'exp.date_created',
        'exp.experiment_type',
        'exp.image_url',
        'exp.image_width',
        'exp.image_height',
        ...userFields,
      )
      .leftJoin(
        'experiment_regions AS reg',
        'exp.id',
        'reg.experiment',
      )
      .leftJoin(
        'visiri_users AS usr',
        'exp.user',
        'usr.id',
      )
      .groupBy('exp.id', 'usr.id')
  },

  getById(db, id) {
    return ExperimentsService.getAllExperiments(db)
      .where('exp.id', id)
      .first()
  },

  getRegionsForExperiment(db, experiment_id) {
    return db
      .from('experiment_regions AS reg')
      .select(
        'reg.id',
        'reg.regions',
        'reg.date_created',
      )
      .where('reg.experiment', experiment_id)
  },

  serializeExperiments(experiments) {
    return experiments.map(this.serializeExperiments)
  },

  serializeExperiment(experiment) {
    const experimentTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const experimentData = experimentTree.grow([experiment]).getData()[0]

    return {
      id: experimentData.id,
      celltype: xss(experimentData.celltype),
      experiment_type: xss(experimentData.experiment_type),
      date_created: experimentData.date_created,
      image_url: experimentData.image_url,
      image_width: experimentData.image_width,
      image_height: experimentData.image_height,
      user: experimentData.user || {},
    }
  },

  serializeExperimentRegions(regions) {
    return regions.map(this.serializeExperimentRegion)
  },

  serializeThingReview(region) {
    const regionTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const regionData = regionTree.grow([region]).getData()[0]

    return {
      id: regionData.id,
      rating: reviewData.rating,
      experiment: regionData.experiment,
      regions: xss(regionData.regions),
      date_created: regionData.date_created,
    }
  },
}

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.full_name AS user:full_name',
  'usr.nickname AS user:nickname',
  'usr.date_created AS user:date_created',
  'usr.date_modified AS user:date_modified',
]

module.exports = ExperimentsService

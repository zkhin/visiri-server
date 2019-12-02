const xss = require('xss')
const Treeize = require('treeize')

const ExperimentsService = {
  getAllUserExperiments(db, username) {
		return db.from('experiments AS exp')
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
        'reg.experiment_id',
      )
      .leftJoin(
        'visiri_users AS usr',
        'exp.user_id',
        'usr.id',
      )
      .groupBy('exp.id', 'usr.id')
			.where('usr.user_name', username)
  },

  getByUserAndId(db, username, id) {
    return ExperimentsService.getAllUserExperiments(db, username)
      .andWhere('exp.id', id)
      .first()
  },



  insertExperiment(db, username, newExperiment) {
    return db
      .insert(newExperiment)
      .into('experiments')
      .returning('*')
      .then(([experiment]) => experiment)
      .then(experiment =>
        ExperimentsService.getByUserAndId(db, username, experiment.id)
      )
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
      user_id: experimentData.user_id || {},
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

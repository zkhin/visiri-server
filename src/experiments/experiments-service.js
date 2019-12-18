const xss = require('xss')
const Treeize = require('treeize')

const ExperimentsService = {
  getAllexperiments(db) {
		return db.from('experiments AS exp')
      .select(
        'exp.id',
        'exp.celltype',
        'exp.date_created',
        'exp.experiment_type',
        'exp.user_id',
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
      .orderBy('exp.id', 'desc')

  },

  getByUserAndId(db, username, id) {
    return ExperimentsService.getAllexperiments(db)
      .where('exp.id', id)
      .andWhere('usr.user_name', username)
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
    return experiments.map(experiment => ExperimentsService.serializeExperiment(experiment))
  },

  serializeExperiment(experiment) {
    const experimentTree = new Treeize()
    const experimentData = experimentTree.grow([experiment]).getData()[0]

    return {
      id: experimentData.id,
      celltype: xss(experimentData.celltype),
      experiment_type: xss(experimentData.experiment_type),
      date_created: experimentData.date_created,
      user_id: experimentData.user_id,
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

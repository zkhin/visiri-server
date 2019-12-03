const Treeize = require('treeize')


const RegionsService = {
  getRegionsForExperiment(db, experiment_id) {
    return db
      .from('experiment_regions AS reg')
      .select(
        'reg.id',
        'reg.regions',
        'reg.date_created',
        'reg.experiment_id',
      )
      .leftJoin(
        'experiments as exp',
        'reg.experiment_id',
        'exp.id',
      )
      .leftJoin(
        'visiri_users as usr',
        'exp.user_id',
        'usr.id',
      )
      .where('exp.id', experiment_id)
  },

  getRegionById(db, region_id) {
    return db
      .from('experiment_regions AS reg')
      .select(
        'reg.id',
        'reg.regions',
        'reg.experiment_id',
        'reg.date_created',
      )
      .where('reg.id', region_id)
      .first()
  },
  insertRegions(db, newRegions) {
    return db
      .insert(newRegions)
      .into('experiment_regions as reg')
      .returning('*')
      .then(([region]) =>
        RegionsService.getRegionById(db, region.id)
      )
  },

  serializeExperimentRegions(regions) {
    return regions.map(this.serializeExperimentRegion)
  },

  serializeExperimentRegion(region) {
    const regionTree = new Treeize()
    const regionData = regionTree.grow([region]).getData()[0]

    return {
      id: regionData.id,
      date_created: regionData.date_created,
      experiment_id: regionData.experiment_id,
      regions: regionData.regions,
    }
  },
}

module.exports = RegionsService
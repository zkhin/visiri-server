const xss = require('xss')
const Treeize = require('treeize')

const ImagesService = {
  getImagesByExperiment(db, exp_id) {
    return db
      .from('images AS img')
      .select(
        'img.id',
        'img.image_url',
        'img.experiment_id',
        'img.image_width',
        'img.image_height',
        'img.date_created',
      )
      .where('img.experiment_id', exp_id)
  },
  getImageById(db, id) {
    return db
      .from('images AS img')
      .select(
        'img.id',
        'img.image_url',
        'img.experiment_id',
        'img.image_width',
        'img.image_height',
        'img.date_created',
      )
      .where('img.id', id)
      .first()
  },
  insertImage(db, newImage) {
    return db
      .insert(newImage)
      .into('images')
      .returning('*')
      .then(([image]) => image)
      .then(image =>
        ImagesService.getImageById(db, image.id)
        )
  },
  serializeImage(image) {
    return {
      id: image.id,
      image_url: image.image_url,
      experiment_id: image.experiment_id,
      image_width: image.image_width,
      image_height: image.image_height,
      date_created: image.date_created,
    }
  }

}

module.exports = ImagesService

const express = require('express')
const { requireAuth } = require('../middleware/jwt-auth')
const multer = require('multer')
const imagesRouter = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, req.app.get('imageFolderPath'))
  },
  filename: (req, file, cb) => {
    let filetype = ''
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpg';
    }
    if (file.mimetype === 'image/tif') {
      filetype = 'tif';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
})

const upload = multer({ storage: storage })

imagesRouter.route('/images')
  .all(requireAuth)
  .post(upload.single('file'), (req, res, next) => {
    if (!req.file) {
      res.status(500)
      return next(err)
    }
    res.json({})
  })

module.exports = imagesRouter
const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'imagestorage')
  },
  filename: (req, file, cb) => {
    let filetype = ''
    if (file.mimetype === 'image/png') {
      filetype = 'png';
    }
    if (file.mimetype === 'image/jpeg') {
      filetype = 'jpeg';
    }
    if (file.mimetype === 'image/tif') {
      filetype = 'tif';
    }
    cb(null, 'image-' + Date.now() + '.' + filetype);
  }
})

const upload = multer({ storage: storage })

module.exports = {
  upload,
}
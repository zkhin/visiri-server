const config = require('../config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const AuthService = {
  createUser(db, newUser) {
    return db
      .insert(newUser)
      .into('visiri_users')
      .returning('*')
      .then(([user]) => user)
      .then(user =>
        AuthService.getUserWithUserName(db, user.user_name)
    )
    .then(user=>user)

  },
  getUserWithUserName(db, user_name) {
    return db('visiri_users')
      .where({ user_name })
      .first()
  },
	comparePasswords(password, hash){
		return bcrypt.compare(password, hash)
	},
	createJwt(subject, payload){
		return jwt.sign(payload, config.JWT_SECRET, {
			subject,
			algorithm: 'HS256'
		})
  },
  verifyJwt(token) {
    return jwt.verify(token, config.JWT_SECRET, {
      algorithms: ['HS256']
    })
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':')
  },
}

module.exports = AuthService

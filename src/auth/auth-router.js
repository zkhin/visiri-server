const express = require('express')
const AuthService = require('./auth-service')
const authRouter = express.Router()
const jsonBodyParser = express.json()
const bcrypt = require('bcryptjs')

authRouter
	.post('/register', (req, res) => {
		let newUsername = req.body.user_name
		AuthService.getUserWithUserName(
			req.app.get('db'),
			newUsername
		)
			.then(dbUser => {
				if (dbUser) {
					return res.status(400).json({
						error: 'User already exists!'
					})
				}
				const newUser = {
					user_name: req.body.user_name,
					full_name: req.body.full_name,
					password: req.body.password,
					nickname: req.body.nickname
				}
				bcrypt.genSalt(10, (err, salt) => {
					if(err) throw err
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw err
						newUser.password = hash
						AuthService.createUser(req.app.get('db'), newUser)
							.then(user => {
								res.status(201)
								res.json(user)
							})
							.catch(err => res.status(400).json(err))
					})
				})
			})
	})
  .post('/login', jsonBodyParser, (req, res, next) => {
		const {user_name, password} = req.body
		const loginUser = {user_name, password}

		for (const [key, value] of Object.entries(loginUser))
			if (value == null)
				return res.status(400).json({
					error: `Missing '${key}' in request body`
				})

		AuthService.getUserWithUserName(
			req.app.get('db'),
			loginUser.user_name
		)
			.then(dbUser =>{
				if (!dbUser)
					return res.status(400).json({
						error: 'Incorrect user_name or password'
					})
				return AuthService.comparePasswords(loginUser.password, dbUser.password)
					.then(compareMatch =>{
						if (!compareMatch) {
							return res.status(400).json({
								error: 'Incorrect user_name or password'
							})
						}
						const sub = dbUser.user_name
						const payload = { user_id: dbUser.id }
						res.send({
							authToken: AuthService.createJwt(sub, payload)
						})
					})
			})
			.catch(next)
  })

module.exports = authRouter

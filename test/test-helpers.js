const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: '2029-01-22T16:28:32.615Z',
    },
  ]
}

function makeExperimentsArray(users) {
  return [
    {
      id: 1,
      celltype: 'Test Cells 1',
      experiment_type: 'Calibration',
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
    },
    {
      id: 2,
      celltype: 'Test Cells 2',
      experiment_type: 'Calibration',
      user_id: users[1].id,
      date_created: '2021-01-22T16:28:32.615Z',
    },
    {
      id: 3,
      celltype: 'Test Cells 3',
      experiment_type: 'Calibration',
      user_id: users[2].id,
      date_created: '2020-01-22T16:28:32.615Z',
    },
  ]
}

function makeImagesArray(experiments) {
	return [
		{
			id: 1,
			experiment_id: experiments[0].id,
			date_created: '2029-01-22T16:28:32.615Z',
			image_url: 'http://localhost:8000/api/images/default.jpeg',
			image_width: 123,
			image_height: 120,
		},
		{
			id: 2,
			experiment_id: experiments[1].id,
			date_created: '2029-01-22T16:12:32.433Z',
			image_url: 'http://localhost:8000/api/images/default.jpeg',
			image_width: 122,
			image_height: 192,
		},
		{
			id: 3,
			experiment_id: experiments[2].id,
			date_created: '2029-01-22T16:12:32.433Z',
			image_url: 'http://localhost:8000/api/images/defaul2.jpeg',
			image_width: 122,
			image_height: 192,
		},
	]
}

function makeRegionsArray(experiments) {
  return [
    {
      id: 1,
      experiment_id: experiments[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
			regions: {data:
				[
					{
						color: "black",
						point: {x: 12, y: 53},
						regionSize: 65,
					},
					{
						color: "red",
						point: {x: 52, y: 153},
						regionSize: 32,
					},
					{
						color: "green",
						point: {x: 12, y: 53},
						regionSize: 65,
					},
				]
			},
    },
    {
      id: 2,
      experiment_id: experiments[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
			regions: {data:
				[
					{
						color: "white",
						point: {x: 12, y: 53},
						regionSize: 65,
					},
					{
						color: "red",
						point: {x: 52, y: 153},
						regionSize: 32,
					},
					{
						color: "green",
						point: {x: 12, y: 53},
						regionSize: 65,
					},
				]
			},
    },
  ];
}

function makeExpectedExperiment(users, experiment, images=[], regions=[]) {
  const user = users
    .find(user => user.id === experiment.user_id)

	// const experimentImages = [images
	// 	.filter(image => image.experiment_id === experiment.id)]
  // const experimentRegions = [regions
  //   .filter(region => region.experiment_id  === experiment.id)]

  return {
    id: experiment.id,
    celltype: experiment.celltype,
    experiment_type: experiment.experiment_type,
    date_created: experiment.date_created,
    user_id: user.id
  }
}

function makeExpectedExperimentImages(experimentId, images = []) {

  const experimentImages = images
    .filter(image => image.experiment_id === experimentId)

  return [{
    id: experimentImages[0].id,
    image_url: experimentImages[0].image_url,
    image_width: experimentImages[0].image_width,
    image_height: experimentImages[0].image_height,
    date_created: experimentImages[0].date_created,
    experiment_id: experimentId,
  }]
}

function makeExpectedExperimentRegions(experimentId, regions = []) {

  const experimentRegions = regions
    .filter(region => region.experiment_id === experimentId)

  return [{
    id: experimentRegions[0].id,
    regions: experimentRegions[0].regions,
    date_created: experimentRegions[0].date_created,
    experiment_id: experimentId,
  }]
}

function makeMaliciousExperiment(user) {
  const maliciousExperiment = {
    id: 911,
    celltype: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    date_created: new Date().toISOString(),
    experiment_type: 'Naughty naughty very naughty <script>alert("xss");</script>',
    user_id: user.id,
  }
  const expectedExperiment = {
    ...makeExpectedExperiment([user], maliciousExperiment),
    experiment_type: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    celltype: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousExperiment,
    expectedExperiment,
  }
}

function makeExperimentsFixtures() {
  const testUsers = makeUsersArray()
  const testExperiments = makeExperimentsArray(testUsers)
	const testImages = makeImagesArray(testExperiments)
  const testRegions = makeRegionsArray(testExperiments)
  return { testUsers, testExperiments, testImages, testRegions }
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      experiments,
      visiri_users,
			images,
			experiment_regions
      RESTART IDENTITY CASCADE`
  )
}

function seedUsers(db, users){
	const preppedUsers = users.map(user =>({
		...user,
			password: bcrypt.hashSync(user.password, 1)
	}))
	return db.into('visiri_users').insert(preppedUsers)
		.then(()=>
			db.raw(
				`SELECT setval('visiri_users_id_seq', ?)`,
				[users[users.length - 1].id],
			)
		)
}


function seedExperimentsTables(db, users, experiments, images=[], regions=[]) {
	return db.transaction(async trx =>{
		await seedUsers(trx, users)
		await trx.into('experiments').insert(experiments)
		// await trx.into('experiments').insert(images)
		await trx.raw(
			`SELECT setval('experiments_id_seq', ?)`,
			experiments[experiments.length -1].id,
    )
    images.length && await trx.into('images').insert(images)
    regions.length && await trx.into('experiment_regions').insert(regions)
	})
}

function seedMaliciousExperiment(db, user, experiment) {
			return seedUsers(db, [user])
				.then(()=>
						db.into('experiments')
							.insert([experiment])
		)

}

function makeAuthHeader(user, secret=process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

function makeBasicAuthHeader(user) {
  const token = Buffer.from(`${user.user_name}:${user.password}`).toString('base64')
  return `Basic ${token}`
}
module.exports = {
  makeUsersArray,
  makeExperimentsArray,
  makeRegionsArray,
	makeImagesArray,
  makeExpectedExperiment,
  makeExpectedExperimentImages,
	makeExpectedExperimentRegions,
  makeMaliciousExperiment,
  makeBasicAuthHeader,
  makeExperimentsFixtures,
  cleanTables,
  seedExperimentsTables,
  seedMaliciousExperiment,
  makeAuthHeader,
	seedUsers,
}

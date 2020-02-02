const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Experiments Endpoints", function() {
  let db;

  const {
    testUsers,
    testExperiments,
    testImages,
    testRegions
  } = helpers.makeExperimentsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe("Protected endpoints", () => {
    const protectedEndpoints = [
      {
        name: "GET /api/experiments/:experiment_id",
        path: "/api/experiments/1"
      },
      {
        name: "GET /api/experiments/:experiment_id/images",
        path: "/api/experiments/1/images"
      },
      {
        name: "GET /api/experiments/:experiment_id/regions",
        path: "/api/experiments/:experiment_id/regions"
      }
    ];

    protectedEndpoints.forEach(endpoint => {
      describe(endpoint.name, () => {
        it(`responds with 401 'Missing bearer token' when no bearer token`, () => {
          return supertest(app)
            .get(endpoint.path)
            .expect(401, { error: `Missing bearer token` });
        });

        it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
          const validUser = testUsers[0];
          const invalidSecret = "bad-secret";
          return supertest(app)
            .get(endpoint.path)
            .set(
              "Authorization",
              helpers.makeAuthHeader(validUser, invalidSecret)
            )
            .expect(401, { error: `Unauthorized request` });
        });

        it(`responds 401 'Unauthorized request' when invalid user`, () => {
          const userInvalidCreds = {
            user_name: "user-not",
            password: "exists"
          };
          return supertest(app)
            .get(endpoint.path)
            .set("Authorization", helpers.makeAuthHeader(userInvalidCreds))
            .expect(401, { error: `Unauthorized request` });
        });

        it(`responds with 401 'Unauthorized request' when invalid password`, () => {
          const userInvalidPass = {
            user_name: testUsers[0].user_name,
            password: "wrong"
          };
          return supertest(app)
            .get(endpoint.path)
            .set("Authorization", helpers.makeAuthHeader(userInvalidPass))
            .expect(401, { error: `Unauthorized request` });
        });
      });
    });
  });

  describe(`GET /api/experiments`, () => {
    before(() => helpers.seedUsers(db, testUsers));
    context(`Given no experiments`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/experiments")
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context("Given there are experiments in the database", () => {
      before("cleanup", () => helpers.cleanTables(db));
      before("insert experiments", () =>
        helpers.seedExperimentsTables(
          db,
          testUsers,
          testExperiments,
          testImages,
          testRegions
        )
      );

      it("responds with 200 and all of the user experiments", () => {
        testUsers.forEach(user => {
          const expectedExperiments = testExperiments.map(experiment =>
            helpers.makeExpectedExperiment(
              testUsers,
              experiment,
              testImages,
              testRegions
            )
          );
          return supertest(app)
            .get("/api/experiments")
            .set("Authorization", helpers.makeAuthHeader(user))
            .expect(200, expectedExperiments);
        });
      });
    });

    context(`Given an XSS attack experiment`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousExperiment,
        expectedExperiment
      } = helpers.makeMaliciousExperiment(testUser);

      beforeEach("insert malicious experiment", () => {
        return helpers.seedMaliciousExperiment(
          db,
          testUser,
          maliciousExperiment
        );
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/experiments`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect(res => {
            expect(res.body[0].celltype).to.eql(expectedExperiment.celltype);
            expect(res.body[0].experiment_type).to.eql(
              expectedExperiment.experiment_type
            );
          });
      });
    });
  });

  describe(`GET /api/experiments/:experiment_id`, () => {
    context(`Given no experiments`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it(`responds with 404`, () => {
        const experimentId = 123456;
        return supertest(app)
          .get(`/api/experiments/${experimentId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Experiment doesn't exist` });
      });
    });

    context("Given there are experiments in the database", () => {
      beforeEach("insert experiments", () =>
        helpers.seedExperimentsTables(
          db,
          testUsers,
          testExperiments,
          testImages,
          testRegions
        )
      );

      it("responds with 200 and the specified experiment", () => {
        const experimentId = 1;
        const expectedExperiment = helpers.makeExpectedExperiment(
          testUsers,
          testExperiments[0],
          testImages,
          testRegions
        );

        return supertest(app)
          .get(`/api/experiments/${experimentId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedExperiment);
      });
    });
  });

  describe(`GET /api/experiments/:experiment_id/images`, () => {
    context(`Given no images`, () => {
      beforeEach("insert images", () =>
        helpers.seedExperimentsTables(db, testUsers, testExperiments)
      );
      it(`responds with empty list`, () => {
        const experimentId = 1;
        return supertest(app)
          .get(`/api/experiments/${experimentId}/images`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context("Given there are images for experiment in the database", () => {
      beforeEach("insert images", () =>
        helpers.seedExperimentsTables(
          db,
          testUsers,
          testExperiments,
          testImages,
          testRegions
        )
      );

      it("responds with 200 and the specified images", () => {
        const experimentId = 1;
        const expectedImages = helpers.makeExpectedExperimentImages(
          experimentId,
          testImages
        );

        return supertest(app)
          .get(`/api/experiments/${experimentId}/images`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedImages);
      });
    });
  });

  describe(`GET /api/experiments/:experiment_id/regions`, () => {
    context(`Given no regions`, () => {
      beforeEach("insert regions", () =>
        helpers.seedExperimentsTables(db, testUsers, testExperiments)
      );
      it(`responds with empty list`, () => {
        const experimentId = 1;
        return supertest(app)
          .get(`/api/experiments/${experimentId}/regions`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });

    context("Given there are regions for experiment in the database", () => {
      beforeEach("insert regions", () =>
        helpers.seedExperimentsTables(
          db,
          testUsers,
          testExperiments,
          testImages,
          testRegions
        )
      );

      it("responds with 200 and the specified regions", () => {
        const experimentId = 1;
        const expectedRegions = helpers.makeExpectedExperimentRegions(
          experimentId,
          testRegions
        );

        return supertest(app)
          .get(`/api/experiments/${experimentId}/regions`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedRegions);
      });
    });
  });
});

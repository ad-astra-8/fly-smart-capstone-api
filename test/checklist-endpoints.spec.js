const knex = require('knex');
const app = require('../src/app');
const config = require("../src/config");

function makeNoteArray() {
	return [
		{
			id: 1,
			user_id: 1,
			item: 'Pack undies',
			completed: 1,
		},
		{
			id: 2,
			user_id: 1,
			item: 'Pack socks',
			completed: 1,
		}
	];
}


function makeFolderArray() {
	return [
		{
			id: 1,
			item: 'Important'
		},
		{
			id: 2,
			item: 'Super'
		},
		{
			id: 3,
			item: 'Spangley'
		}
	];
}

describe('fly-smart-capstone API - checklist', function () {

	describe('Checklist Endpoints', function () {
		let db;

		before('make knex instance', () => {
			db = knex({
				client: 'pg',
				connection: config.TEST_DATABASE_URL
			});
			app.set('db', db);
		});

		after('disconnect from db', () => db.destroy());

		before('clean the table', () =>
			db.raw('TRUNCATE checklist, users, checklist, notes RESTART IDENTITY CASCADE')
		);

		afterEach('cleanup', () =>
			db.raw('TRUNCATE checklist, users, checklist, notes RESTART IDENTITY CASCADE')
		);

		describe(`GET /api/checklist`, () => {
			context(`Given no checklist`, () => {
				it(`responds with 200 and an empty list`, () => {
					return supertest(app)
						.get('/api/checklist')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(200, []);
				});
			});

			context('Given there are checklist in the database', () => {
				const testNote = makeNoteArray();
				const testFolder = makeFolderArray();


				it(`responds with 200 and an empty list`, () => {
					return supertest(app)
						.get('/api/checklist')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(200, []);
				});

				it('responds with 200 and all of the checklist', () => {
					return supertest(app)
						.get('/api/checklist')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(res => {
							expect(200, testFolder);
						});

				});
			});




		});

	});
});
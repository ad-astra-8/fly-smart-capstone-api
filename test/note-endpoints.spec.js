const knex = require('knex');
const app = require('../src/app');


describe('fly-smart-capstone API - notes', function () {

	describe('Note Endpoints', function () {
		let db;

		before('make knex instance', () => {
			db = knex({
				client: 'pg',
				connection: process.env.TEST_DATABASE_URL
			});
			app.set('db', db);
		});

		after('disconnect from db', () => db.destroy());

		before('clean the table', () =>
			db.raw('TRUNCATE note, notes RESTART IDENTITY CASCADE')
		);

		afterEach('cleanup', () =>
			db.raw('TRUNCATE note, notes RESTART IDENTITY CASCADE')
		);

		describe(`GET /api/notes`, () => {
			context(`Given no notes`, () => {
				it(`responds with 200 and an empty list`, () => {
					return supertest(app)
						.get('/api/notes')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(200, []);
				});
			});

			context('Given there are notes in the database', () => {
				const testNote = makeNoteArray();

				beforeEach('insert note', () => {
					return db
						.into('notes')
						.insert(testFolder)
						.then(() => {
							return db.into('note').insert(testNote);
						});
				});

				it('responds with 200 and all of the notes', () => {
					return supertest(app)
						.get('/api/notes')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(res => {
							expect(res.body[0].name).to.eql(testNote[0].name);
							expect(res.body[0]).to.have.property('id');
						});

				});
			});


			context(`Given an XSS attack note`, () => {
				const testFolder = makeFolderArray();
				const { maliciousNote, expectedNote } = makeMaliciousNote();

				beforeEach('insert malicious note', () => {
					return db
						.into('notes')
						.insert(testFolder)
						.then(() => {
							return db.into('note').insert([maliciousNote]);
						});
				});

				it('removes XSS attack note name or content', () => {
					return supertest(app)
						.get(`/api/notes`)
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(200)
						.expect(res => {
							expect(res.body[0].name).to.eql(expectedNote.name);
							expect(res.body[0].content).to.eql(expectedNote.content);
						});
				});
			});


		});

	});
});
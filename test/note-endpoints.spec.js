const knex = require('knex');
const app = require('../src/app');
const config = require("../src/config");


function makeNoteArray() {
	return [
		{
			id: 1,
			note: 'Note one',
			completed: 1
		},
		{
			id: 2,
			note: 'Note two',
			completed: 0
		}
	];
}


function makeMaliciousNote() {
	const maliciousNote = {
		id: 911,
		note: 'MaliciousNote',
		id_folder: 1,
		content: 'Naughty naughty very naughty <script>alert("xss");</script>'
	};

	const expectedNote = {
		...maliciousNote,
		content:
			'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
		description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
	};
	return {
		maliciousNote,
		expectedNote
	};
}


describe('fly-smart-capstone API - notes', function () {

	describe('Note Endpoints', function () {
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
			db.raw('TRUNCATE notes RESTART IDENTITY CASCADE')
		);

		afterEach('cleanup', () =>
			db.raw('TRUNCATE notes RESTART IDENTITY CASCADE')
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

				beforeEach('insert notes', () => {
							return db.into('notes').insert(testNote);
				});

				it('responds with 200 and all of the notes', () => {
					return supertest(app)
						.get('/api/notes')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(res => {
							expect(res.body[0].note).to.eql(testNote[0].note);
							expect(res.body[0]).to.have.property('id');
						});

				});
			});


		});

		describe(`DELETE /api/notes/:note_id`, () => {
			context(`Given no notes`, () => {
			  it(`responds with 404`, () => {
				const noteId = 123456
				return supertest(app)
				  .delete(`/api/notes/${noteId}`)
				  .expect(404, { error: { message: `Note doesn't exist` } })
			  })
			})
		
			context('Given there are notes in the database', () => {
				const testNotes = makeNoteArray()
		
			  beforeEach('insert notes', () => {
				return db
				  .into('notes')
				  .then(() => {
					return db
					  .into('notes')
					  .insert(testNotes)
				  })
			  })
		
			  it('responds with 204 and removes the notes', () => {
				const idToRemove = 2
				const expectedNotes = testNotes.filter( notes => notes.id !== idToRemove)
				return supertest(app)
				  .delete(`/api/notes/${idToRemove}`)
				  .expect(204)
				  .then(res =>
					supertest(app)
					  .get(`/api/notes`)
					  .expect(expectedNotes)
				  )
			  })
			})
		  })

	});
});
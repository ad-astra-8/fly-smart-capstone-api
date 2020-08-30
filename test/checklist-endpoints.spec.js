const knex = require('knex');
const app = require('../src/app');

function makeNoteArray() {
	return [
		{
			id: 1,
			name: 'Dogs',
			id_folder: 1,
			content: 'Note 1',
			modified: '2029-01-22T16:28:32.615Z'
		},
		{
			id: 2,
			name: 'Cats',
			id_folder: 1,
			content: 'Note 2',
			modified: '2100-05-23T04:28:32.615Z'
		}
	];
}

function makeMaliciousNote() {
	const maliciousNote = {
		id: 911,
		name: 'MaliciousNote',
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

function makeFolderArray() {
	return [
		{
			id: 1,
			name: 'Important'
		},
		{
			id: 2,
			name: 'Super'
		},
		{
			id: 3,
			name: 'Spangley'
		}
	];
}

describe('fly-smart-capstone API - checklist', function () {

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
			db.raw('TRUNCATE item, checklist RESTART IDENTITY CASCADE')
		);

		afterEach('cleanup', () =>
			db.raw('TRUNCATE item, checklist RESTART IDENTITY CASCADE')
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

				beforeEach('insert item', () => {
					return db
						.into('checklist')
						.insert(testFolder)
						.then(() => {
							return db.into('item').insert(testNote);
						});
				});

				it('responds with 200 and all of the checklist', () => {
					return supertest(app)
						.get('/api/checklist')
						.set('Authorization', `Bearer ${process.env.API_TOKEN}`)
						.expect(res => {
							expect(res.body[0].name).to.eql(testNote[0].name);
							expect(res.body[0]).to.have.property('id');
						});

				});
			});


			context(`Given an XSS attack item`, () => {
				const testFolder = makeFolderArray();
				const { maliciousNote, expectedNote } = makeMaliciousNote();

				beforeEach('insert malicious item', () => {
					return db
						.into('checklist')
						.insert(testFolder)
						.then(() => {
							return db.into('item').insert([maliciousNote]);
						});
				});

				it('removes XSS attack item name or content', () => {
					return supertest(app)
						.get(`/api/checklist`)
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
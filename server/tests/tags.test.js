const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Tag = require('../models/tags');
const Question = require('../models/questions');

describe('Tag Routes', () => {
    let server;

  
  beforeAll((done) => {
    server = app.listen(8888, () => {
      console.log('Server started on port 8888');
      done();
    });
  });

  
  afterAll((done) => {
    server.close(() => {
      console.log('Server closed');
      done();
      // mongoose.disconnect(done);
    });
  });
  // Clear the database before each test
  beforeEach(async () => {
    await Tag.deleteMany();
    await Question.deleteMany();
  });

  // Test getting tags with question numbers
  it('should get tags with question numbers', async () => {
    // Create some tags
    const tagIds = await Promise.all(['JavaScript', 'Node.js', 'Express.js'].map(async tagName => {
        const tag = await Tag.create({ name: tagName });
        return tag._id;
      }));

    // Create some questions with tags
    await Question.create({ title: 'Question 1', text: '...', tags: tagIds, asked_by: 'testUser' });
    await Question.create({ title: 'Question 2', text: '...', tags: tagIds, asked_by: 'testUser'});
    await Question.create({ title: 'Question 3', text: '...', tags: tagIds, asked_by: 'testUser'});

    const response = await request(app)
      .get('/tag/getTagsWithQuestionNumber')
      .expect(200);

    // Assert response data
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(3);
    expect(response.body).toContainEqual({ name: 'JavaScript', qcnt: 3 });
    expect(response.body).toContainEqual({ name: 'Node.js', qcnt: 3 });
    expect(response.body).toContainEqual({ name: 'Express.js', qcnt: 3 });
  });
});

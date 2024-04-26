const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Question = require('../models/questions');
const User = require('../models/users');

describe('Question Routes', () => {
  // Clear the database before each test
  beforeEach(async () => {
    await Question.deleteMany();
    await User.deleteMany();
  });

  // Test adding a new question
  it('should add a new question', async () => {
    const userData = { username: 'testUser', password: 'password123' };

    // Register a new user
    await request(app)
        .post('/user/register')
        .send(userData)
        .expect(200);

    // Log in with the registered user
    const res1 = await request(app)
        .post('/user/login')
        .send(userData)
        .expect(200);
    const questionData = {
      title: 'Test Question',
      text: 'This is a test question.',
      asked_by: 'testUser',
      ask_date_time: new Date(),
      tags: ['test', 'unit-testing']
    };
    const response = await request(app)
      .post('/question/addQuestion')
        .set('Cookie', res1.headers['set-cookie'])
      .send(questionData)
      .expect(200);

    // Assert response data
    expect(response.body.title).toBe(questionData.title);
    expect(response.body.text).toBe(questionData.text);
    expect(response.body.asked_by).toBe(questionData.asked_by);
    // expect(response.body.tags).toEqual(expect.arrayContaining(questionData.tags));

    // Check if the question exists in the database
    const question = await Question.findOne({ title: questionData.title });
    expect(question).toBeTruthy();
  });

  // Test getting questions filtered by order and search
  it('should get questions filtered by order and search', async () => {
    const response = await request(app)
      .get('/question/getQuestion?order=newest&search=test')
      .expect(200);

    // Assert response data
    expect(Array.isArray(response.body)).toBe(true);
    // Add more assertions based on expected response data
  });

  // Test getting a question by ID
  const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// ...

it('should get a question by ID', async () => {
  const tags = ['test', 'unit-testing'];
  const tagIds = tags.map(tag => new ObjectId()); // Convert tag strings to ObjectIds
  const questionData = {
    title: 'Test Question',
    text: 'This is a test question.',
    asked_by: 'testUser',
    ask_date_time: new Date(),
    tags: tagIds, // Assign generated ObjectIds to tags
    views: 99
  };
  const question = await Question.create(questionData);

  
  const response = await request(app)
    .get(`/question/getQuestionById/${question._id}`)
    .expect(200);

  // Assert response data
  expect(response.body.title).toBe(questionData.title);
  expect(response.body.text).toBe(questionData.text);
  expect(response.body.asked_by).toBe(questionData.asked_by);
  expect(response.body.views).toBe(questionData.views + 1);
  
});

it('should get a question by ID pure', async () => {
  const tags = ['test', 'unit-testing'];
  const tagIds = tags.map(tag => new ObjectId()); 
  const questionData = {
    title: 'Test Question',
    text: 'This is a test question.',
    asked_by: 'testUser',
    ask_date_time: new Date(),
    tags: tagIds 
  };
  const question = await Question.create(questionData);

  const response = await request(app)
    .get(`/question/getQuestionByIdPure/${question._id}`)
    .expect(200);

  // Assert response data
  expect(response.body.title).toBe(questionData.title);
  expect(response.body.text).toBe(questionData.text);
  expect(response.body.asked_by).toBe(questionData.asked_by);
  
});

it('should update a question by ID', async () => {
  // Create a question in the database
  const questionData = {
    title: 'Original Title',
    text: 'Original Text',
    asked_by: 'testUser',
  };
  const createdQuestion = await Question.create(questionData);

  // New data to update the question
  const newData = {
    title: 'Updated Title',
    text: 'Updated Text',
    asked_by: 'testUser',
  };

  const userData = { username: 'testUser', password: 'password123' };

    // Register a new user
    await request(app)
        .post('/user/register')
        .send(userData)
        .expect(200);

    // Log in with the registered user
    const res1 = await request(app)
        .post('/user/login')
        .send(userData)
        .expect(200);

  // Send a request to update the question
  const response = await request(app)
    .put(`/question/updateQuestionById/${createdQuestion._id}`)
    .send(newData)
    .set('Cookie', res1.headers['set-cookie'])
    .expect(200);

  // Assert that the response contains the updated question
  expect(response.body.title).toBe(newData.title);
  expect(response.body.text).toBe(newData.text);

  // Fetch the question from the database to verify that it has been updated
  const updatedQuestion = await Question.findById(createdQuestion._id);
  expect(updatedQuestion.title).toBe(newData.title);
  expect(updatedQuestion.text).toBe(newData.text);
});

it('should return questions asked by a specific user', async () => {
  // Create a user
  const userData = { username: 'testUser', password: 'password123' };
  // await User.create(userData);
  await request(app)
    .post('/user/register')
    .send(userData)

  // Create questions asked by the user
  const questionData1 = {
    title: 'Question 1',
    text: 'This is question 1',
    asked_by: 'testUser',
  };
  const questionData2 = {
    title: 'Question 2',
    text: 'This is question 2',
    asked_by: 'testUser',
  };
  await Question.create(questionData1);
  await Question.create(questionData2);

  // Log in as the user
  const res1 = await request(app)
    .post('/user/login')
    .send(userData)
    .expect(200);
  console.log(typeof res1.body.username);


  // Send a request to get questions by the logged-in user
  const response = await request(app)
    .get('/question/getQuestionByUser')
    .set('Cookie', res1.headers['set-cookie'])
    .expect(200);

  
  // Assert that the response contains questions asked by the user
  expect(response.body.length).toBe(2);
  expect(response.body[0].title).toBe(questionData1.title);
  expect(response.body[0].text).toBe(questionData1.text);
  expect(response.body[1].title).toBe(questionData2.title);
  expect(response.body[1].text).toBe(questionData2.text);
});
});



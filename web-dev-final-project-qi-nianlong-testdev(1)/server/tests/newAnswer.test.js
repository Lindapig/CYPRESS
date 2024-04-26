const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Answer = require('../models/answers');
const Question = require('../models/questions');

describe('Answer Routes', () => {
    
  // Clear the database before each test
  beforeEach(async () => {
    await Answer.deleteMany();
    await Question.deleteMany();
  });

  // Test adding a new answer
  it('should add a new answer', async () => {
    const questionData = {
      title: 'Test Question',
      text: 'This is a test question.',
      asked_by: 'testUser',
      ask_date_time: new Date()
    };
    const question = await Question.create(questionData);

    const answerData = {
      qid: question._id,
      ans: {
        text: 'This is a test answer.',
        ans_by: 'testUser',
        ans_date: new Date()
      }
    };

    const response = await request(app)
      .post('/answer/addAnswer')
      .send(answerData)
      .expect(200);

    // Assert response data
    expect(response.body.text).toBe(answerData.ans.text);
    expect(response.body.ans_by).toBe(answerData.ans.ans_by);

    // Check if the answer exists in the database
    const answer = await Answer.findOne({ text: answerData.ans.text });
    expect(answer).toBeTruthy();

    // Check if the question is updated with the new answer
    const updatedQuestion = await Question.findById(question._id);
    expect(updatedQuestion.answers.length).toBe(1);
    expect(updatedQuestion.answers[0].toString()).toBe(answer._id.toString());
  });

  // Test getting an answer by ID
  it('should get an answer by ID', async () => {
    const answerData = {
      text: 'This is a test answer.',
      ans_by: 'testUser',
      ans_date: new Date()
    };
    const answer = await Answer.create(answerData);

    const response = await request(app)
      .get(`/answer/getAnswerById/${answer._id}`)
      .expect(200);

    // Assert response data
    expect(response.body.text).toBe(answerData.text);
    expect(response.body.ans_by).toBe(answerData.ans_by);
  });
});

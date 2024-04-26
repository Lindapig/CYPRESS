const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const Answer = require('../models/answers');
const Question = require('../models/questions');
const Comment = require('../models/comments');

describe('Comment Routes', () => {
    
  // Clear the database before each test
  beforeEach(async () => {
    await Answer.deleteMany();
    await Question.deleteMany();
    await Comment.deleteMany();
  });

  // Test adding a new comment to a question
  it('should add a new comment to a question', async () => {
    const questionData = {
      title: 'Test Question',
      text: 'This is a test question.',
      asked_by: 'testUser',
      ask_date_time: new Date(),
    //   tags: ['test', 'unit-testing']
    };
    const question = await Question.create(questionData);

    const commentData = {
      id: question._id,
      type: 'question',
      comment: {
        text: 'This is a test comment.',
        com_by: 'testUser',
        com_date_time: new Date()
      }
    };

    const response = await request(app)
      .post('/comment/addComment')
      .send(commentData)
      .expect(200);

    // Assert response data
    expect(response.body.text).toBe(commentData.comment.text);
    expect(response.body.com_by).toBe(commentData.comment.com_by);

    // Check if the comment exists in the database
    const comment = await Comment.findOne({ text: commentData.comment.text });
    expect(comment).toBeTruthy();

    // Check if the question is updated with the new comment
    const updatedQuestion = await Question.findById(question._id);
    expect(updatedQuestion.comments.length).toBe(1);
    expect(updatedQuestion.comments[0].toString()).toBe(comment._id.toString());
  });

  // Test adding a new comment to an answer
  it('should add a new comment to an answer', async () => {
    const answerData = {
      text: 'This is a test answer.',
      ans_by: 'testUser',
      ans_date: new Date()
    };
    const answer = await Answer.create(answerData);

    const commentData = {
      id: answer._id,
      type: 'answer',
      comment: {
        text: 'This is a test comment.',
        com_by: 'testUser',
        com_date_time: new Date()
      }
    };

    const response = await request(app)
      .post('/comment/addComment')
      .send(commentData)
      .expect(200);

    // Assert response data
    expect(response.body.text).toBe(commentData.comment.text);
    expect(response.body.com_by).toBe(commentData.comment.com_by);

    // Check if the comment exists in the database
    const comment = await Comment.findOne({ text: commentData.comment.text });
    expect(comment).toBeTruthy();

    // Check if the answer is updated with the new comment
    const updatedAnswer = await Answer.findById(answer._id);
    expect(updatedAnswer.comments.length).toBe(1);
    expect(updatedAnswer.comments[0].toString()).toBe(comment._id.toString());
  });
});

const supertest = require("supertest");
const mongoose = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");
const Comment = require("../models/comments");
const express = require("express");
const app = require("../server"); 

const router = require("../controller/like"); 

jest.mock("../models/answers");
jest.mock("../models/questions");
jest.mock("../models/comments");

let server;

describe('POST /clickLike', () => {
    
  beforeEach(() => {
    server = app.use(express.json()).use(router); 
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  it('should like a question', async () => {
    // Mock request body
    const mockReqBody = {
      id: '65e9b58910afe6e94fc6e6dc', 
      type: 'question',
      usrn: 'mockUser', 
    };

    // Mock the updated question
    const mockUpdatedQuestion = {
      _id: mockReqBody.id,
      title: 'Question Title',
      text: 'Question Text',
      likes: ['mockUser'], 
    };

    // Mock the behavior of the Question.findOneAndUpdate method
    Question.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedQuestion);

    // Making the request
    const response = await supertest(server)
      .post('/clickLike')
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedQuestion);
  });

});

describe('POST /clickDislike', () => {
  beforeEach(() => {
    server = app.use(express.json()).use(router); 
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  it('should dislike a question', async () => {
    
    const mockReqBody = {
      id: '65e9b58910afe6e94fc6e6dc', 
      type: 'question',
      usrn: 'mockUser', 
    };

    // Mock the updated question
    const mockUpdatedQuestion = {
      _id: mockReqBody.id,
      title: 'Question Title',
      text: 'Question Text',
      likes: [], 
    };

    
    Question.findOneAndUpdate.mockResolvedValueOnce(mockUpdatedQuestion);

    
    const response = await supertest(server)
      .post('/clickDislike')
      .send(mockReqBody);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUpdatedQuestion);
  });

  
});

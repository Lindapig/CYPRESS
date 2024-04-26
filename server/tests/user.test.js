const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/users');

describe('User Authentication', () => {
  
  // Clear the database before each test
  beforeEach(async () => {
    await User.deleteMany();
  });

  // Test user registration
  it('should register a new user', async () => {
    const userData = { username: 'testUser', password: 'password123' };
    const response = await request(app)
      .post('/user/register')
      .send(userData)
      .expect(200);

    // Assert response data
    expect(response.body.username).toBe(userData.username);

    // Check if the user exists in the database
    const user = await User.findOne({ username: userData.username });
    expect(user).toBeTruthy();
    expect(user.username).toBe(userData.username);
    expect(user.password).not.toBe(userData.password); 
  });

  // Test user login
  it('should log in a registered user', async () => {
    const userData = { username: 'testUser', password: 'password123' };
    const response1 = await request(app)
      .post('/user/register')
      .send(userData)
      .expect(200);

    // Log in with the registered user
    const response = await request(app)
      .post('/user/login')
      .send(userData)
      .expect(200);

    // Assert response data
    expect(response.body.username).toBe(userData.username);

    // Check if the session is set
    expect(response.headers['set-cookie']).toBeTruthy();
  });

  // Test user logout
  it('should log out a logged-in user', async () => {
    const userData = { username: 'testUser', password: 'password123' };
    const response1 = await request(app)
      .post('/user/register')
      .send(userData)
      .expect(200);
    // Log in with a mock user
    await request(app)
      .post('/user/login')
      .send({ username: 'testUser', password: 'password123' })
      .expect(200);
      ;

    // Log out
    const response = await request(app)
      .post('/user/logout')
      .expect(200);

    // Assert response data
    expect(response.body.message).toBe('logged out');
  });

  // Test session check for logged-in user
  it('should return username if user is logged in', async () => {
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

    // Check login status
    const response = await request(app)
        .post('/user/isLoggedIn')
        .set('Cookie', res1.headers['set-cookie'])
        .expect(200);

    // Assert response data
    expect(response.body.username).toBe('testUser');
});



  // Test session check for non-logged-in user
  it('should return 401 if user is not logged in', async () => {
    // Check login status without logging in
    await request(app)
      .post('/user/isLoggedIn')
      .expect(401);
  });
});

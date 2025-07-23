const request = require('supertest');
const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

// Mock modules
jest.mock('child_process', () => ({
  spawn: jest.fn(() => ({
    unref: jest.fn(),
  }))
}));

jest.mock('fs', () => ({
  existsSync: jest.fn(() => true),
}));

jest.mock('http', () => ({
  get: jest.fn((options, callback) => {
    // Simulate immediate success response
    callback({ statusCode: 200 });
    return {
      on: jest.fn(),
    };
  }),
}));

// Mock the game configs
jest.mock('../config/games.js', () => ({
  'tetris': { 
    path: '/path/to/tetris',
    port: 3001 
  },
  'memory': { 
    path: '/path/to/memory',
    port: 3002 
  },
  'candy-crush': { 
    path: '/path/to/candy-crush',
    port: 3003 
  }
}));

// Setup the app
const app = express();
const gameRoutes = require('../routes/gameRoutes');
app.use('/api', gameRoutes);

describe('Game Routes', () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
  });

  test('GET /api/:gameId returns game URL for valid game ID', async () => {
    const res = await request(app).get('/api/tetris');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('url', 'http://localhost:3001');
    expect(spawn).toHaveBeenCalledWith('npm', ['run', 'dev'], expect.any(Object));
  });

  test('GET /api/:gameId returns 404 for invalid game ID', async () => {
    const res = await request(app).get('/api/invalid-game');
    
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('Invalid game ID');
    expect(spawn).not.toHaveBeenCalled();
  });

  test('GET /api/:gameId returns 500 if game directory does not exist', async () => {
    // Mock existsSync to return false for this test
    fs.existsSync.mockReturnValueOnce(false);
    
    const res = await request(app).get('/api/tetris');
    
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body.message).toContain('Game directory not found');
    expect(spawn).not.toHaveBeenCalled();
  });

  test('GET /api/:gameId reuses running game instance', async () => {
    // First request starts the game
    await request(app).get('/api/tetris');
    expect(spawn).toHaveBeenCalledTimes(1);
    
    // Second request should reuse the running instance
    const res = await request(app).get('/api/tetris');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('url', 'http://localhost:3001');
    // spawn should still have been called only once
    expect(spawn).toHaveBeenCalledTimes(1);
  });

  test('POST /api/:gameId redirects to GET handler', async () => {
    const res = await request(app).post('/api/tetris');
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('url', 'http://localhost:3001');
  });
});

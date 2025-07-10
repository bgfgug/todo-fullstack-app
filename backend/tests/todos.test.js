const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const todoRoutes = require('../routes/todos');
const authRoutes = require('../routes/auth');
const Todo = require('../models/Todo');
const User = require('../models/User');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);
app.use(errorHandler);

describe('Todo Routes', () => {
  let authToken;
  let userId;
  let todoId;

  beforeEach(async () => {
    // Create and login user
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Password123'
    };
    
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    authToken = registerResponse.body.token;
    userId = registerResponse.body.user._id;

    // Create a sample todo
    const todoData = {
      title: 'Test Todo',
      description: 'Test description',
      priority: 'medium'
    };

    const todoResponse = await request(app)
      .post('/api/todos')
      .set('Authorization', `Bearer ${authToken}`)
      .send(todoData);
    
    todoId = todoResponse.body._id;
  });

  describe('GET /api/todos', () => {
    it('should get todos for authenticated user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.todos).toBeDefined();
      expect(response.body.total).toBeDefined();
      expect(response.body.page).toBe(1);
      expect(response.body.limit).toBe(10);
      expect(Array.isArray(response.body.todos)).toBe(true);
    });

    it('should filter todos by completion status', async () => {
      const response = await request(app)
        .get('/api/todos?completed=false')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.todos.forEach(todo => {
        expect(todo.completed).toBe(false);
      });
    });

    it('should filter todos by priority', async () => {
      const response = await request(app)
        .get('/api/todos?priority=medium')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      response.body.todos.forEach(todo => {
        expect(todo.priority).toBe('medium');
      });
    });

    it('should search todos by title or description', async () => {
      const response = await request(app)
        .get('/api/todos?search=test')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.todos.length).toBeGreaterThan(0);
    });

    it('should not get todos without authentication', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(401);

      expect(response.body.message).toBe('No token provided, access denied');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'New Todo',
        description: 'New todo description',
        priority: 'high'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBe(todoData.description);
      expect(response.body.priority).toBe(todoData.priority);
      expect(response.body.completed).toBe(false);
      expect(response.body.userId).toBe(userId);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.message).toBe('Validation failed');
    });
  });

  describe('GET /api/todos/:id', () => {
    it('should get a specific todo', async () => {
      const response = await request(app)
        .get(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(todoId);
      expect(response.body.title).toBe('Test Todo');
    });

    it('should return 404 for non-existent todo', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      
      const response = await request(app)
        .get(`/api/todos/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Todo not found');
    });
  });

  describe('PUT /api/todos/:id', () => {
    it('should update a todo', async () => {
      const updateData = {
        title: 'Updated Todo',
        description: 'Updated description',
        priority: 'low'
      };

      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.priority).toBe(updateData.priority);
    });
  });

  describe('PATCH /api/todos/:id/toggle', () => {
    it('should toggle todo completion status', async () => {
      const response = await request(app)
        .patch(`/api/todos/${todoId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.completed).toBe(true);

      // Toggle again
      const response2 = await request(app)
        .patch(`/api/todos/${todoId}/toggle`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response2.body.completed).toBe(false);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('should soft delete a todo', async () => {
      const response = await request(app)
        .delete(`/api/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.message).toBe('Todo deleted successfully');

      // Verify todo is not returned in list
      const listResponse = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const deletedTodo = listResponse.body.todos.find(todo => todo._id === todoId);
      expect(deletedTodo).toBeUndefined();
    });
  });
});
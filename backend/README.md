# Todo App Backend

A robust Node.js backend for a Todo application with authentication, CRUD operations, and comprehensive features.

## Features

- ✅ **Authentication**: JWT-based auth with bcrypt password hashing
- ✅ **CRUD Operations**: Full Create, Read, Update, Delete for todos
- ✅ **User Management**: Registration, login, profile management
- ✅ **Pagination & Filtering**: Query todos with pagination and filters
- ✅ **Input Validation**: Comprehensive validation using express-validator
- ✅ **Security**: Rate limiting, CORS, helmet, input sanitization
- ✅ **Error Handling**: Centralized error handling middleware
- ✅ **Database**: MongoDB with Mongoose ODM
- ✅ **Seeding**: Faker.js for generating test data

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: morgan
- **Testing**: Jest + Supertest (configured)

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB** (if using local installation)

4. **Seed the database:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

The server will start on `http://localhost:5000`

## Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `POST /api/auth/logout` - User logout (protected)

### Todos
- `GET /api/todos` - Get todos with pagination/filtering (protected)
- `POST /api/todos` - Create new todo (protected)
- `GET /api/todos/:id` - Get single todo (protected)
- `PUT /api/todos/:id` - Update todo (protected)
- `DELETE /api/todos/:id` - Delete todo (protected)
- `PATCH /api/todos/:id/toggle` - Toggle todo completion (protected)

### Query Parameters for GET /api/todos

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `completed` - Filter by completion status (true/false)
- `priority` - Filter by priority (low/medium/high)
- `search` - Search in title and description

Example: `GET /api/todos?page=1&limit=5&completed=false&priority=high&search=urgent`

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Create Todo
```bash
POST /api/todos
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the todo app project",
  "priority": "high",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable origin whitelist
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation on all endpoints
- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT**: Secure token-based authentication
- **Soft Delete**: Todos are marked as deleted, not permanently removed

## Data Models

### User
```javascript
{
  name: String (required, 2-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date
}
```

### Todo
```javascript
{
  title: String (required, max 100 chars),
  description: String (optional, max 500 chars),
  completed: Boolean (default: false),
  priority: String (enum: ['low', 'medium', 'high'], default: 'medium'),
  dueDate: Date (optional),
  userId: ObjectId (ref: User, required),
  isDeleted: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with fake data
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Development

### Adding New Routes

1. Create controller in `controllers/`
2. Add validation in `middleware/validation.js`
3. Create route file in `routes/`
4. Import route in `server.js`

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm test -- --coverage
```

## Deployment

### Heroku
1. Set environment variables in Heroku dashboard
2. Ensure `NODE_ENV=production`
3. Deploy using Git or GitHub integration

### Docker (coming soon)
```bash
docker build -t todo-backend .
docker run -p 5000:5000 --env-file .env todo-backend
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

MIT License - see LICENSE file for details
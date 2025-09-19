# DevOps Task Manager - Full Stack Learning Project

A comprehensive full-stack application designed for DevOps engineers to understand frontend, backend, and database interactions, API calls, and system architecture.

## 🏗️ Architecture Overview

```
Frontend (React)     Backend (Node.js)      Database (SQLite)
    ↓                       ↓                       ↓
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  React UI   │  HTTP │   Express   │  SQL  │   SQLite    │
│             │ ────→ │    Server   │ ────→ │  Database   │
│  - Login    │       │             │       │             │
│  - Tasks    │       │  - Auth     │       │  - Users    │
│  - Stats    │       │  - CRUD     │       │  - Tasks    │
└─────────────┘       └─────────────┘       └─────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Git (optional)

### 1. Start Backend Server
```bash
cd backend
npm install
npm run dev
```
Server will start on: http://localhost:5000

### 2. Start Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
Frontend will start on: http://localhost:5173

### 3. Access the Application
- Open: http://localhost:5173
- Demo Login:
  - Username: `admin`
  - Password: `password123`

## 📁 Project Structure

```
DEVOPS Understanding/
├── backend/                    # Node.js/Express API Server
│   ├── server.js              # Main server file
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   └── database.sqlite        # SQLite database (auto-generated)
│
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Login.jsx      # Authentication
│   │   │   ├── Register.jsx   # User registration
│   │   │   ├── Dashboard.jsx  # Main dashboard
│   │   │   ├── TaskList.jsx   # Task display
│   │   │   ├── TaskForm.jsx   # Task creation/editing
│   │   │   ├── Stats.jsx      # Statistics display
│   │   │   └── *.css          # Component styles
│   │   ├── contexts/          # React context for state
│   │   ├── services/          # API communication
│   │   └── App.jsx            # Main app component
│   └── package.json           # Frontend dependencies
│
└── README.md                  # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Tasks Management
- `GET /api/tasks` - Get user tasks (with filtering)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Statistics & Health
- `GET /api/stats` - Get user statistics
- `GET /api/health` - Health check endpoint

### Example API Calls

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'
```

#### Create Task (requires authentication token)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title": "New Task", "description": "Task description", "priority": "high"}'
```

#### Get Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);
```

## 🔐 Security Features

- **Password Hashing**: Using bcryptjs for secure password storage
- **JWT Authentication**: JSON Web Tokens for session management
- **CORS Protection**: Cross-Origin Resource Sharing configuration
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries with SQLite

## 🎯 DevOps Learning Points

### 1. **Frontend-Backend Communication**
- HTTP requests (GET, POST, PUT, DELETE)
- JSON data exchange
- Authentication headers
- Error handling
- State management

### 2. **API Design**
- RESTful principles
- Status codes
- Request/Response patterns
- Authentication middleware
- Route organization

### 3. **Database Operations**
- CRUD operations
- Relationships (Foreign Keys)
- Data validation
- Queries and filtering

### 4. **Security Implementation**
- Authentication flow
- Token-based security
- Password encryption
- Protected routes

### 5. **Development Workflow**
- Environment setup
- Dependency management
- Development servers
- Hot reloading

## 🛠️ DevOps Commands & Testing

### Backend Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password123"}'

# Test protected endpoint (replace TOKEN)
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer TOKEN"
```

### Frontend Testing
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Inspection
The SQLite database file is located at `backend/database.sqlite`. You can inspect it using:
- SQLite Browser
- Command line: `sqlite3 database.sqlite`
- VS Code SQLite extensions

## 📊 Monitoring & Logging

### Health Monitoring
- Health check endpoint: `/api/health`
- Returns system status, version, and environment
- Use for uptime monitoring

### Application Logs
- Server startup information
- API request logging
- Error tracking
- Database connection status

### Performance Metrics
- Response times
- Request counts
- Error rates
- Database query performance

## 🔧 Environment Configuration

### Backend Environment Variables (.env)
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your-super-secure-jwt-secret-key
DATABASE_URL=./database.sqlite
API_BASE_URL=http://localhost:5000/api
FRONTEND_URL=http://localhost:5173
```

### Frontend Configuration
- API base URL configuration in `services/api.js`
- CORS setup for development
- Environment-specific builds

## 🚦 Deployment Considerations

### Production Checklist
- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV=production
- [ ] Configure proper database (PostgreSQL/MySQL for production)
- [ ] Set up reverse proxy (nginx)
- [ ] Configure SSL/TLS certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategies
- [ ] Set up CI/CD pipelines

### Docker Setup (Optional Enhancement)
```dockerfile
# Backend Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing Scenarios

### Manual Testing Checklist
- [ ] User registration with validation
- [ ] User login with demo credentials
- [ ] Create tasks with different priorities
- [ ] Update task status
- [ ] Delete tasks
- [ ] Filter tasks by status
- [ ] View statistics
- [ ] Test responsive design
- [ ] Test API error handling
- [ ] Test authentication token expiry

### API Testing with Tools
- **Postman**: Import API collection for testing
- **Insomnia**: REST client for API testing
- **Thunder Client**: VS Code extension for API testing

## 📚 Learning Resources

### Understanding the Stack
1. **Frontend (React)**:
   - Component lifecycle
   - State management
   - API integration
   - Routing

2. **Backend (Node.js/Express)**:
   - HTTP server creation
   - Middleware concepts
   - Authentication patterns
   - Database integration

3. **Database (SQLite)**:
   - SQL queries
   - Data relationships
   - Migrations
   - Performance optimization

### Next Steps for DevOps Engineers
1. **Containerization**: Docker and Docker Compose
2. **Orchestration**: Kubernetes basics
3. **CI/CD**: GitHub Actions, Jenkins
4. **Monitoring**: Prometheus, Grafana
5. **Cloud Deployment**: AWS, Azure, GCP
6. **Infrastructure as Code**: Terraform, Ansible

## 🐛 Troubleshooting

### Common Issues

#### Backend won't start
- Check if port 5000 is available
- Verify Node.js version (v16+)
- Check .env file configuration
- Review npm install output for errors

#### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration
- Verify API base URL in frontend config
- Check browser console for errors

#### Database errors
- SQLite file permissions
- Database initialization
- SQL syntax in queries
- Foreign key constraints

#### Authentication issues
- JWT secret configuration
- Token expiration
- CORS headers
- Password hashing

### Debug Commands
```bash
# Check running processes
netstat -an | findstr :5000
netstat -an | findstr :5173

# View logs
npm run dev  # Both frontend and backend show logs

# Database queries
sqlite3 backend/database.sqlite ".tables"
sqlite3 backend/database.sqlite "SELECT * FROM users;"
```

## 🤝 Contributing

This is a learning project! Feel free to:
- Add new features
- Improve error handling
- Enhance security
- Add tests
- Improve documentation
- Add monitoring
- Implement new deployment strategies

## 📝 License

This project is created for educational purposes. Feel free to use, modify, and distribute for learning DevOps concepts.

---

**Happy Learning! 🚀**

This project provides hands-on experience with modern web development and DevOps practices. Use it as a foundation to understand how frontend, backend, and database components work together in a real-world application.
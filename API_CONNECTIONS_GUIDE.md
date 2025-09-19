# API CONNECTIONS EXPLAINED - Complete Guide
## Understanding How Frontend, Backend, and Database Talk to Each Other

---

## 🌐 WHAT ARE APIs?

**API** = Application Programming Interface

Think of APIs like **restaurant ordering**:
- **Customer** (Frontend) orders food
- **Waiter** (API) takes order to kitchen
- **Kitchen** (Backend) prepares food using ingredients
- **Storage** (Database) provides ingredients
- **Waiter** (API) brings food back to customer

---

## 🔗 CONNECTION ARCHITECTURE

### **Complete System Map:**
```
[Your Browser]  ←→  [Frontend React App]  ←→  [Express API Server]  ←→  [SQLite Database]
   Port ???           Port 5173              Port 5000               File: database.sqlite

User Interface  ←→  JavaScript Code      ←→  Node.js Server       ←→  Data Storage
```

### **Communication Protocols:**
- **Browser ↔ Frontend**: Direct (same application)
- **Frontend ↔ Backend**: HTTP requests (axios library)
- **Backend ↔ Database**: SQL queries (sqlite3 library)

---

## 📡 HTTP COMMUNICATION DETAILS

### **How HTTP Requests Work:**

#### **Request Structure:**
```
[Method] [URL] [Headers] [Body]
   ↓      ↓       ↓        ↓
  POST  /api/login  Auth   {username, password}
```

#### **Response Structure:**
```
[Status Code] [Headers] [Body]
      ↓          ↓        ↓
     200      Content   {token, user}
```

### **Our API Base URL Configuration:**

#### **Frontend Configuration (frontend/src/services/api.js):**
```javascript
const API_BASE_URL = 'http://localhost:5000/api';

// Every API call goes to this address
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### **How Requests Are Built:**
```javascript
// When frontend calls: tasksAPI.getTasks()
// Axios creates: GET http://localhost:5000/api/tasks

// When frontend calls: tasksAPI.createTask(data)
// Axios creates: POST http://localhost:5000/api/tasks
```

---

## 🛣️ COMPLETE API ENDPOINT MAP

### **Authentication Endpoints:**

#### **POST /api/auth/login**
```
Purpose: User login
Frontend Location: components/Login.jsx (line 28)
Backend Location: server.js (lines 94-121)
Database Query: SELECT * FROM users WHERE username = ?

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Send      Verify    Find      Create    Store
credentials → password → user → JWT token → token
```

#### **POST /api/auth/register**
```
Purpose: Create new user account
Frontend Location: components/Register.jsx (line 38)
Backend Location: server.js (lines 123-150)
Database Query: INSERT INTO users (username, email, password) VALUES (?, ?, ?)

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Send      Hash      Insert    Create    Store
user data → password → user → JWT token → token
```

### **Task Management Endpoints:**

#### **GET /api/tasks**
```
Purpose: Get all user's tasks
Frontend Location: services/api.js (line 45)
Backend Location: server.js (lines 170-185)
Database Query: SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Request   Check     Query     Return    Display
tasks  →  auth  →   user's →  tasks  →  in UI
                    tasks
```

#### **POST /api/tasks**
```
Purpose: Create new task
Frontend Location: components/TaskForm.jsx (line 32)
Backend Location: server.js (lines 187-205)
Database Query: INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Send      Validate  Insert    Return    Refresh
task data → data  →  task   →  ID    →  task list
```

#### **PUT /api/tasks/:id**
```
Purpose: Update existing task
Frontend Location: components/Dashboard.jsx (line 62)
Backend Location: server.js (lines 225-250)
Database Query: UPDATE tasks SET ... WHERE id = ? AND user_id = ?

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Send      Check     Update    Confirm   Refresh
changes → ownership → task  →  success → UI
```

#### **DELETE /api/tasks/:id**
```
Purpose: Delete task
Frontend Location: components/Dashboard.jsx (line 72)
Backend Location: server.js (lines 252-270)
Database Query: DELETE FROM tasks WHERE id = ? AND user_id = ?

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Send      Check     Delete    Confirm   Remove
task ID → ownership → task  →  success → from UI
```

### **System Endpoints:**

#### **GET /api/health**
```
Purpose: Check if backend is running
Frontend Location: services/api.js (line 73)
Backend Location: server.js (lines 65-72)
Database Query: None

Flow:
Frontend → Backend → Backend → Frontend
  ↓         ↓         ↓         ↓
Request → Process → Return → Display
health    status    OK      status
```

#### **GET /api/stats**
```
Purpose: Get user statistics
Frontend Location: services/api.js (line 69)
Backend Location: server.js (lines 295-310)
Database Query: Complex aggregation query counting tasks by status

Flow:
Frontend → Backend → Database → Backend → Frontend
  ↓         ↓         ↓         ↓         ↓
Request → Check   → Count   → Return → Display
stats     auth      tasks     stats    charts
```

---

## 🔐 AUTHENTICATION FLOW

### **Step-by-Step Authentication Process:**

#### **Step 1: User Submits Login Form**
```javascript
// In Login.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await login(formData);
  // formData = {username: "admin", password: "password123"}
};
```

#### **Step 2: Frontend Calls Auth API**
```javascript
// In AuthContext.jsx
const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  // Makes HTTP POST to /api/auth/login
};
```

#### **Step 3: API Service Makes Request**
```javascript
// In services/api.js
login: async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  // POST http://localhost:5000/api/auth/login
  // Body: {"username": "admin", "password": "password123"}
  return response.data;
}
```

#### **Step 4: Backend Receives Request**
```javascript
// In server.js
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  // Extract username and password from request
```

#### **Step 5: Database Lookup**
```javascript
// In server.js
db.get(
  'SELECT * FROM users WHERE username = ? OR email = ?',
  [username, username],
  async (err, user) => {
    // Query database for user
```

#### **Step 6: Password Verification**
```javascript
// In server.js
const isValidPassword = await bcrypt.compare(password, user.password);
if (!isValidPassword) {
  return res.status(401).json({ error: 'Invalid credentials' });
}
```

#### **Step 7: JWT Token Creation**
```javascript
// In server.js
const token = jwt.sign(
  { id: user.id, username: user.username }, 
  JWT_SECRET, 
  { expiresIn: '24h' }
);
```

#### **Step 8: Response Back to Frontend**
```javascript
// Backend sends:
res.json({ 
  message: 'Login successful', 
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: { id: 1, username: 'admin', email: 'admin@example.com' }
});
```

#### **Step 9: Frontend Stores Token**
```javascript
// In AuthContext.jsx
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
setUser(user);
```

#### **Step 10: All Future Requests Include Token**
```javascript
// In services/api.js - Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📊 REAL REQUEST/RESPONSE EXAMPLES

### **Example 1: Login Request**

#### **Frontend Request:**
```javascript
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

#### **Backend Response:**
```javascript
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTY5NTc0NTIwMCwiZXhwIjoxNjk1ODMxNjAwfQ.abc123...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com"
  }
}
```

### **Example 2: Create Task Request**

#### **Frontend Request:**
```javascript
POST http://localhost:5000/api/tasks
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Learn DevOps",
  "description": "Study this application architecture",
  "priority": "high",
  "status": "pending"
}
```

#### **Backend Response:**
```javascript
HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Task created successfully",
  "task": {
    "id": 6,
    "title": "Learn DevOps",
    "description": "Study this application architecture",
    "priority": "high",
    "status": "pending"
  }
}
```

### **Example 3: Get Tasks Request**

#### **Frontend Request:**
```javascript
GET http://localhost:5000/api/tasks
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Backend Response:**
```javascript
HTTP/1.1 200 OK
Content-Type: application/json

{
  "tasks": [
    {
      "id": 1,
      "title": "Setup Development Environment",
      "description": "Configure Node.js, React, and database",
      "status": "completed",
      "priority": "high",
      "user_id": 1,
      "created_at": "2025-09-19 17:00:00",
      "updated_at": "2025-09-19 17:30:00"
    },
    {
      "id": 2,
      "title": "Implement Authentication",
      "description": "Create login and registration system",
      "status": "in-progress",
      "priority": "high",
      "user_id": 1,
      "created_at": "2025-09-19 17:01:00",
      "updated_at": "2025-09-19 17:01:00"
    }
  ],
  "total": 2
}
```

---

## 🔄 ERROR HANDLING FLOW

### **Frontend Error Handling:**

#### **API Response Interceptor:**
```javascript
// In services/api.js
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### **Component Error Handling:**
```javascript
// In Login.jsx
try {
  const result = await login(formData);
  if (result.success) {
    navigate('/dashboard');
  } else {
    setError(result.error);  // Show error to user
  }
} catch {
  setError('An unexpected error occurred');
}
```

### **Backend Error Handling:**

#### **Database Error Example:**
```javascript
// In server.js
db.run(sqlQuery, params, function(err) {
  if (err) {
    console.error('Database error:', err);
    return res.status(500).json({ error: 'Database error' });
  }
  // Success handling
});
```

#### **Validation Error Example:**
```javascript
// In server.js
if (!title) {
  return res.status(400).json({ error: 'Title is required' });
}
```

#### **Authentication Error Example:**
```javascript
// In server.js
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  // ... token verification
};
```

---

## 🛠️ TESTING API CONNECTIONS

### **Method 1: Browser Network Tab**
1. Open your web application
2. Press F12 (Developer Tools)
3. Go to "Network" tab
4. Perform actions (login, create task, etc.)
5. See all HTTP requests and responses

### **Method 2: PowerShell Commands**

#### **Test Health Endpoint:**
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health"
```

#### **Test Login:**
```powershell
$loginData = @{
    username = "admin"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $response.token
Write-Host "Token: $token"
```

#### **Test Protected Endpoint:**
```powershell
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Headers $headers
```

#### **Test Create Task:**
```powershell
$taskData = @{
    title = "Test Task from PowerShell"
    description = "Testing API connection"
    priority = "medium"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Method POST -Body $taskData -Headers $headers -ContentType "application/json"
```

### **Method 3: Using Postman**

#### **Setup Collection:**
1. Download Postman
2. Create new collection "DevOps Task Manager"
3. Add requests for each endpoint

#### **Login Request Setup:**
```
Method: POST
URL: http://localhost:5000/api/auth/login
Headers: Content-Type: application/json
Body (raw JSON):
{
  "username": "admin",
  "password": "password123"
}
```

#### **Tasks Request Setup:**
```
Method: GET
URL: http://localhost:5000/api/tasks
Headers: 
- Content-Type: application/json
- Authorization: Bearer {{token}}
```

---

## 🔍 DEBUGGING CONNECTION ISSUES

### **Common Issues and Solutions:**

#### **CORS Errors:**
```
Error: "Access to fetch at 'http://localhost:5000/api/tasks' from origin 'http://localhost:5173' has been blocked by CORS policy"

Solution: Check backend CORS configuration in server.js:
const cors = require('cors');
app.use(cors());  // Allows all origins in development
```

#### **Connection Refused:**
```
Error: "Failed to fetch" or "ERR_CONNECTION_REFUSED"

Check:
1. Is backend server running? (npm run dev in backend folder)
2. Is it on the correct port? (Should show "Server running on http://localhost:5000")
3. Is frontend pointing to correct URL? (Check services/api.js)
```

#### **Authentication Errors:**
```
Error: 401 Unauthorized

Check:
1. Is token being sent? (Browser Network tab, check headers)
2. Is token format correct? (Should be "Bearer eyJ...")
3. Is token expired? (Check JWT payload)
4. Is backend JWT_SECRET configured? (Check .env file)
```

#### **Database Errors:**
```
Error: 500 Internal Server Error

Check:
1. Does database file exist? (backend/database.sqlite)
2. Are tables created? (Check server startup logs)
3. Is user_id valid? (Check foreign key constraints)
```

### **Debug Tools:**

#### **Backend Logging:**
```javascript
// Add to server.js for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

#### **Frontend Logging:**
```javascript
// Add to services/api.js for debugging
api.interceptors.request.use((config) => {
  console.log('Making request:', config.method.toUpperCase(), config.url, config.data);
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.log('Request failed:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## 📈 PERFORMANCE MONITORING

### **Response Time Monitoring:**

#### **Backend Performance Logging:**
```javascript
// Add to server.js
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});
```

#### **Frontend Performance Monitoring:**
```javascript
// Add to services/api.js
api.interceptors.request.use((config) => {
  config.requestStartTime = Date.now();
  return config;
});

api.interceptors.response.use(
  (response) => {
    const duration = Date.now() - response.config.requestStartTime;
    console.log(`API call completed in ${duration}ms`);
    return response;
  }
);
```

---

## 🎯 API BEST PRACTICES

### **Frontend Best Practices:**
- ✅ Use axios interceptors for common functionality
- ✅ Handle loading states while requests are in progress
- ✅ Implement proper error handling and user feedback
- ✅ Cache frequently accessed data when appropriate
- ✅ Use environment variables for API URLs

### **Backend Best Practices:**
- ✅ Validate all input data
- ✅ Use proper HTTP status codes
- ✅ Implement rate limiting for production
- ✅ Log all requests and errors
- ✅ Use parameterized queries to prevent SQL injection

### **Security Best Practices:**
- ✅ Always validate JWT tokens
- ✅ Use HTTPS in production
- ✅ Implement proper CORS policies
- ✅ Never expose sensitive data in API responses
- ✅ Use secure password hashing

---

## ✅ API CONNECTION MASTERY CHECKLIST

After studying this guide, you should understand:

**Basic Level:**
- [ ] What APIs are and how they work
- [ ] How frontend makes HTTP requests to backend
- [ ] How backend queries the database
- [ ] The complete request/response cycle

**Intermediate Level:**
- [ ] How authentication tokens work
- [ ] How to test APIs manually with PowerShell/curl
- [ ] How to debug connection issues
- [ ] How error handling works at each layer

**Advanced Level:**
- [ ] How to implement new API endpoints
- [ ] How to optimize API performance
- [ ] How to secure API endpoints
- [ ] How to monitor API health and performance

**Expert Level:**
- [ ] How to design RESTful API architectures
- [ ] How to implement API versioning
- [ ] How to handle high-traffic scenarios
- [ ] How to implement microservices communication

Understanding these API connections is crucial for DevOps work, as you'll need to troubleshoot communication issues, monitor API performance, and ensure secure data flow in production environments!
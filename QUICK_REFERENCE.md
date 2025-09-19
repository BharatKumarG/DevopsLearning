# DevOps Application - Quick Reference Guide
## Everything You Need to Know in One Place

---

## 🚀 GETTING STARTED

### **Start the Application:**
```bash
# Terminal 1: Start Backend
cd backend
npm run dev
# Wait for: "Server running on http://localhost:5000"

# Terminal 2: Start Frontend  
cd frontend
npm run dev
# Wait for: "Local: http://localhost:5173/"
```

### **Access Points:**
- **Frontend UI**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Database File**: `backend/database.sqlite`

### **Demo Login:**
- **Username**: `admin`
- **Password**: `password123`

---

## 📁 PROJECT STRUCTURE SUMMARY

```
DEVOPS Understanding/
├── 📁 frontend/                 ← React App (User Interface)
│   ├── src/components/          ← UI Components
│   │   ├── Login.jsx           ← Login page
│   │   ├── Dashboard.jsx       ← Main page
│   │   ├── TaskList.jsx        ← Shows tasks
│   │   └── TaskForm.jsx        ← Create/edit tasks
│   ├── src/services/api.js     ← Talks to backend
│   └── package.json            ← Frontend dependencies
│
├── 📁 backend/                  ← Node.js Server (Brain)
│   ├── server.js               ← ALL backend code here
│   ├── database.sqlite         ← Database file (auto-created)
│   ├── .env                    ← Configuration
│   └── package.json            ← Backend dependencies
│
└── 📄 Documentation files       ← Learning guides
```

---

## 🗄️ DATABASE QUICK FACTS

### **Location:** `backend/database.sqlite`

### **Tables:**
```sql
users: id, username, email, password, created_at
tasks: id, title, description, status, priority, user_id, created_at, updated_at
```

### **View Database:**
1. Download: DB Browser for SQLite
2. Open: `backend/database.sqlite`
3. Browse tables and data

### **Sample Data:**
- **User**: admin / password123
- **Tasks**: 5 sample tasks already created

---

## 🌐 API ENDPOINTS CHEAT SHEET

### **Authentication:**
```bash
POST /api/auth/login     # Login user
POST /api/auth/register  # Create account
```

### **Tasks:**
```bash
GET    /api/tasks        # Get all tasks
POST   /api/tasks        # Create task
PUT    /api/tasks/:id    # Update task
DELETE /api/tasks/:id    # Delete task
```

### **System:**
```bash
GET /api/health          # Server status
GET /api/stats          # User statistics
```

---

## 🔗 HOW CONNECTIONS WORK

### **Data Flow:**
```
[Browser] → [React App] → [Express API] → [SQLite DB]
    ↑           ↑             ↑             ↑
User clicks → JavaScript → HTTP Request → SQL Query
  button      sends data    to backend     to database
```

### **Authentication Flow:**
```
1. User enters login
2. Frontend sends to /api/auth/login
3. Backend checks database
4. Backend creates JWT token
5. Frontend stores token
6. All future requests include token
```

---

## 🧪 TESTING COMMANDS

### **PowerShell Testing:**
```powershell
# Test backend health
Invoke-RestMethod -Uri "http://localhost:5000/api/health"

# Test login
$login = @{username="admin"; password="password123"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $login -ContentType "application/json"

# Test with token
$headers = @{Authorization="Bearer $($response.token)"}
Invoke-RestMethod -Uri "http://localhost:5000/api/tasks" -Headers $headers
```

### **Health Check Script:**
```bash
# Run the automated test
powershell -ExecutionPolicy Bypass -File .\test-system.ps1
```

---

## 🔧 TROUBLESHOOTING

### **Backend Won't Start:**
```bash
# Check if port 5000 is in use
netstat -an | findstr :5000

# Restart backend
cd backend
npm install
npm run dev
```

### **Frontend Won't Connect:**
```bash
# Check backend is running first
curl http://localhost:5000/api/health

# Restart frontend
cd frontend
npm install
npm run dev
```

### **Database Issues:**
```bash
# Delete and recreate database
rm backend/database.sqlite
# Restart backend - database will be recreated with sample data
```

### **Login Not Working:**
- Use exact credentials: `admin` / `password123`
- Check browser console for errors
- Verify backend is running

---

## 📊 FILE LOCATIONS

### **Key Frontend Files:**
- **Main App**: `frontend/src/App.jsx`
- **API Client**: `frontend/src/services/api.js`
- **Login**: `frontend/src/components/Login.jsx`
- **Dashboard**: `frontend/src/components/Dashboard.jsx`

### **Key Backend Files:**
- **Main Server**: `backend/server.js` (ALL backend logic here)
- **Environment**: `backend/.env`
- **Database**: `backend/database.sqlite` (auto-created)

### **Key Database Code in server.js:**
- **Lines 15-40**: Database setup and table creation
- **Lines 95-120**: Login functionality
- **Lines 170-185**: Get tasks
- **Lines 187-205**: Create task
- **Lines 225-250**: Update task
- **Lines 252-270**: Delete task

---

## 🎯 WHAT EACH COMPONENT DOES

### **Frontend (React):**
- **Purpose**: User interface
- **Technology**: React + Vite
- **Port**: 5173
- **Main Job**: Display data and send user actions to backend

### **Backend (Node.js):**
- **Purpose**: Business logic and API
- **Technology**: Express.js
- **Port**: 5000
- **Main Job**: Process requests, handle authentication, manage database

### **Database (SQLite):**
- **Purpose**: Data storage
- **Technology**: SQLite (file-based)
- **Location**: `backend/database.sqlite`
- **Main Job**: Store users and tasks persistently

---

## 🔐 SECURITY FEATURES

### **Authentication:**
- JWT tokens for session management
- Password hashing with bcrypt
- Protected routes require valid token

### **API Security:**
- CORS enabled for development
- Input validation on all endpoints
- SQL injection prevention with parameterized queries

### **Data Privacy:**
- Users only see their own tasks
- Passwords never stored in plain text
- Tokens expire after 24 hours

---

## 📚 LEARNING PROGRESSION

### **Week 1: Basic Understanding**
- [ ] Understand the three-tier architecture
- [ ] Start and access the application
- [ ] View database with DB Browser
- [ ] Complete login and task creation

### **Week 2: API Understanding**
- [ ] Test all API endpoints manually
- [ ] Understand request/response format
- [ ] Learn about HTTP status codes
- [ ] Practice with PowerShell commands

### **Week 3: Code Reading**
- [ ] Read through server.js line by line
- [ ] Understand React component structure
- [ ] Trace data flow from UI to database
- [ ] Learn about state management

### **Week 4: Modifications**
- [ ] Add new fields to tasks
- [ ] Create new API endpoints
- [ ] Modify UI components
- [ ] Test your changes

---

## 🛠️ DEVELOPMENT COMMANDS

### **Root Level Commands:**
```bash
npm run dev          # Start both frontend and backend
npm run test         # Run health check script
npm install:all      # Install all dependencies
```

### **Backend Commands:**
```bash
npm run dev          # Start with auto-restart
npm start           # Start production mode
npm install         # Install dependencies
```

### **Frontend Commands:**
```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm install         # Install dependencies
```

---

## 🔍 MONITORING

### **Health Checks:**
- **Backend**: http://localhost:5000/api/health
- **Frontend**: http://localhost:5173
- **Database**: Check if `backend/database.sqlite` exists

### **Logs to Watch:**
- **Backend**: Console shows all API requests
- **Frontend**: Browser console shows React errors
- **Database**: Backend logs show SQL query results

### **Performance:**
- **Response times**: Shown in backend logs
- **Frontend loading**: Browser Network tab
- **Database queries**: SQLite is fast for development

---

## 🎓 NEXT STEPS

### **For DevOps Learning:**
1. **Containerization**: Add Docker support
2. **Orchestration**: Learn Kubernetes basics
3. **CI/CD**: Set up automated deployment
4. **Monitoring**: Add application monitoring
5. **Cloud**: Deploy to AWS/Azure/GCP

### **For Development Skills:**
1. **Testing**: Add unit and integration tests
2. **Security**: Implement advanced security features
3. **Performance**: Optimize database queries
4. **Features**: Add file uploads, notifications
5. **Architecture**: Learn microservices patterns

---

## ⚡ COMMON TASKS

### **View All Users:**
```sql
-- In DB Browser or SQLite command line
SELECT * FROM users;
```

### **View All Tasks:**
```sql
SELECT u.username, t.title, t.status 
FROM users u 
JOIN tasks t ON u.id = t.user_id;
```

### **Create New User:**
```powershell
$userData = @{
    username="newuser"
    email="new@example.com"
    password="newpassword"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $userData -ContentType "application/json"
```

### **Backup Database:**
```bash
cp backend/database.sqlite backend/database_backup_$(date +%Y%m%d).sqlite
```

---

## 📞 HELP & RESOURCES

### **If You're Stuck:**
1. Check if both servers are running
2. Run the health check script
3. Check browser console for errors
4. Verify database file exists
5. Read the relevant documentation file

### **Documentation Files:**
- `COMPLETE_EXPLANATION_GUIDE.md` - Comprehensive tutorial
- `DATABASE_DEEP_DIVE.md` - Database details
- `API_CONNECTIONS_GUIDE.md` - API communication
- `README.md` - Project overview

### **External Resources:**
- React: https://react.dev/learn
- Express: https://expressjs.com/en/guide/
- SQLite: https://www.sqlitetutorial.net/
- Node.js: https://nodejs.org/en/docs/

---

**🎉 You now have everything you need to understand and work with this DevOps application!**

Remember: This is a learning project, so experiment, break things, and fix them. That's how you learn DevOps!
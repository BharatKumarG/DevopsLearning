# DATABASE DEEP DIVE - Complete Explanation
## Understanding the SQLite Database in Our DevOps Project

---

## 🗄️ DATABASE BASICS - What Is It?

Think of a database like a **digital filing cabinet**:
- **Tables** = Folders in the cabinet
- **Rows** = Individual documents in each folder  
- **Columns** = Information fields on each document

In our project:
- **users table** = Employee records folder
- **tasks table** = Task assignment folder

---

## 📍 WHERE IS THE DATABASE?

### **Exact Location:**
```
Your Computer Path:
C:\Users\bhara\OneDrive\Desktop\APP DEVELOP\DEVOPS Understanding\backend\database.sqlite

Project Path:
DEVOPS Understanding/
└── backend/
    └── database.sqlite  ← THIS IS YOUR DATABASE FILE
```

### **How to Find It:**
1. Open File Explorer
2. Navigate to your project folder
3. Go into the `backend` folder
4. Look for `database.sqlite` file (may show as just "database")

### **File Properties:**
- **Type**: SQLite Database File
- **Size**: Starts small (few KB), grows with data
- **Created**: When you first run the backend server
- **Modified**: Every time data changes

---

## 🏗️ DATABASE STRUCTURE

### **Table 1: users**
Stores account information for people who can log in.

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique number for each user
    username TEXT UNIQUE NOT NULL,         -- Login name (must be unique)
    email TEXT UNIQUE NOT NULL,           -- Email address (must be unique)
    password TEXT NOT NULL,               -- Encrypted password
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- When account was created
);
```

**Real Data Example:**
```
| id | username | email               | password                           | created_at          |
|----|----------|--------------------|------------------------------------|---------------------|
| 1  | admin    | admin@example.com  | $2a$10$N9qo8uLOickgx2ZMRZo... | 2025-09-19 17:00:00 |
| 2  | john     | john@company.com   | $2a$10$M8po7tKNjcigx3ZMRYp... | 2025-09-19 18:15:00 |
```

### **Table 2: tasks**
Stores all tasks/to-do items for users.

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique task number
    title TEXT NOT NULL,                   -- Task name/title
    description TEXT,                      -- Detailed description (optional)
    status TEXT DEFAULT 'pending',        -- pending, in-progress, completed
    priority TEXT DEFAULT 'medium',       -- low, medium, high
    user_id INTEGER NOT NULL,             -- Which user owns this task
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- When task was created
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- When task was last changed
    FOREIGN KEY (user_id) REFERENCES users (id)     -- Links to users table
);
```

**Real Data Example:**
```
| id | title        | description      | status      | priority | user_id | created_at          | updated_at          |
|----|--------------|------------------|-------------|----------|---------|---------------------|---------------------|
| 1  | Setup Env    | Configure tools  | completed   | high     | 1       | 2025-09-19 17:00:00 | 2025-09-19 17:30:00 |
| 2  | Learn APIs   | Study endpoints  | in-progress | medium   | 1       | 2025-09-19 17:01:00 | 2025-09-19 17:01:00 |
| 3  | Write Tests  | Create unit tests| pending     | low      | 1       | 2025-09-19 17:02:00 | 2025-09-19 17:02:00 |
| 4  | Deploy App   | Upload to server | pending     | high     | 2       | 2025-09-19 18:20:00 | 2025-09-19 18:20:00 |
```

---

## 🔗 TABLE RELATIONSHIPS

### **Foreign Key Relationship:**
```
users.id ←→ tasks.user_id
```

**What this means:**
- Each task belongs to exactly one user
- Each user can have many tasks
- If user_id = 1 in tasks table, that task belongs to user with id = 1

**Visual Representation:**
```
USER (id: 1, username: admin)
├── TASK (id: 1, title: "Setup Env", user_id: 1)
├── TASK (id: 2, title: "Learn APIs", user_id: 1)
└── TASK (id: 3, title: "Write Tests", user_id: 1)

USER (id: 2, username: john)
└── TASK (id: 4, title: "Deploy App", user_id: 2)
```

---

## 💾 HOW DATABASE IS CREATED

### **Automatic Creation Process:**

#### **Step 1: Server Starts**
When you run `npm run dev` in the backend folder:

```javascript
// This code runs in server.js
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);
```

#### **Step 2: Check if File Exists**
- If `database.sqlite` doesn't exist → SQLite creates it
- If it exists → SQLite opens the existing file

#### **Step 3: Create Tables**
```javascript
db.serialize(() => {
  // Create users table if it doesn't exist
  db.run(`CREATE TABLE IF NOT EXISTS users (...)`);
  
  // Create tasks table if it doesn't exist  
  db.run(`CREATE TABLE IF NOT EXISTS tasks (...)`);
});
```

#### **Step 4: Insert Sample Data**
```javascript
// Add demo user if no users exist
const samplePassword = bcrypt.hashSync('password123', 10);
db.run(`INSERT OR IGNORE INTO users (username, email, password) VALUES (?, ?, ?)`, 
  ['admin', 'admin@example.com', samplePassword]);

// Add sample tasks
db.run(`INSERT OR IGNORE INTO tasks (title, description, status, priority, user_id) VALUES 
  ('Setup Development Environment', 'Configure Node.js, React, and database', 'completed', 'high', 1),
  ('Implement Authentication', 'Create login and registration system', 'in-progress', 'high', 1),
  // ... more tasks
`);
```

---

## 🔍 HOW TO VIEW DATABASE CONTENT

### **Method 1: DB Browser for SQLite (Recommended)**

#### **Download and Install:**
1. Go to: https://sqlitebrowser.org/
2. Download for Windows
3. Install the application

#### **Open Your Database:**
1. Launch DB Browser for SQLite
2. Click "Open Database"
3. Navigate to: `DEVOPS Understanding\backend\database.sqlite`
4. Click "Open"

#### **View Data:**
1. Click "Browse Data" tab
2. Select table from dropdown (users or tasks)
3. See all data in spreadsheet format
4. Use filters to search specific data

#### **Execute SQL Queries:**
1. Click "Execute SQL" tab
2. Type queries like:
   ```sql
   SELECT * FROM users;
   SELECT * FROM tasks WHERE status = 'pending';
   SELECT u.username, t.title FROM users u JOIN tasks t ON u.id = t.user_id;
   ```
3. Click "Execute" button
4. See results below

### **Method 2: Command Line**

#### **Open Command Prompt:**
```bash
# Navigate to backend folder
cd "C:\Users\bhara\OneDrive\Desktop\APP DEVELOP\DEVOPS Understanding\backend"

# Start SQLite command line
sqlite3 database.sqlite
```

#### **Common Commands:**
```sql
-- See all tables
.tables

-- Describe table structure
.schema users
.schema tasks

-- View all users
SELECT * FROM users;

-- View all tasks
SELECT * FROM tasks;

-- View tasks with user information
SELECT u.username, t.title, t.status 
FROM users u 
JOIN tasks t ON u.id = t.user_id;

-- Count tasks by status
SELECT status, COUNT(*) 
FROM tasks 
GROUP BY status;

-- Exit SQLite
.quit
```

### **Method 3: VS Code Extension**

#### **Install Extension:**
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search "SQLite Viewer"
4. Install the extension

#### **Use Extension:**
1. Open your project in VS Code
2. Navigate to `backend/database.sqlite`
3. Right-click the file
4. Select "Open Database"
5. Browse tables and data

---

## 🔄 DATABASE OPERATIONS IN CODE

### **Where Database Code Lives:**
All database operations are in `backend/server.js`. Here's exactly where:

#### **Database Connection (Lines 13-15):**
```javascript
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);
```

#### **Table Creation (Lines 17-40):**
```javascript
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (...)`);
  db.run(`CREATE TABLE IF NOT EXISTS tasks (...)`);
  
  // Insert sample data
  db.run(`INSERT OR IGNORE INTO users ...`);
  db.run(`INSERT OR IGNORE INTO tasks ...`);
});
```

#### **User Login (Lines 100-130):**
```javascript
app.post('/api/auth/login', async (req, res) => {
  db.get(
    'SELECT * FROM users WHERE username = ? OR email = ?',
    [username, username],
    async (err, user) => {
      // Check password and create token
    }
  );
});
```

#### **Get User Tasks (Lines 150-170):**
```javascript
app.get('/api/tasks', authenticateToken, (req, res) => {
  db.all(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
    [req.user.id],
    (err, tasks) => {
      res.json({ tasks });
    }
  );
});
```

#### **Create New Task (Lines 190-210):**
```javascript
app.post('/api/tasks', authenticateToken, (req, res) => {
  const { title, description, status, priority } = req.body;
  
  db.run(
    'INSERT INTO tasks (title, description, status, priority, user_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, status, priority, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      
      res.status(201).json({ 
        message: 'Task created successfully',
        task: { id: this.lastID, title, description, status, priority }
      });
    }
  );
});
```

#### **Update Task (Lines 230-260):**
```javascript
app.put('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, priority } = req.body;
  
  db.run(
    'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
    [title, description, status, priority, taskId, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
      
      res.json({ message: 'Task updated successfully' });
    }
  );
});
```

#### **Delete Task (Lines 270-290):**
```javascript
app.delete('/api/tasks/:id', authenticateToken, (req, res) => {
  const taskId = req.params.id;
  
  db.run(
    'DELETE FROM tasks WHERE id = ? AND user_id = ?',
    [taskId, req.user.id],
    function(err) {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (this.changes === 0) return res.status(404).json({ error: 'Task not found' });
      
      res.json({ message: 'Task deleted successfully' });
    }
  );
});
```

---

## 📊 REAL-TIME DATABASE MONITORING

### **Watch Database Changes Live:**

#### **Setup:**
1. Open DB Browser for SQLite
2. Open your database file
3. Go to "Browse Data" tab
4. Select "tasks" table
5. Keep this window open

#### **Test Changes:**
1. Open your web application (http://localhost:5173)
2. Log in with admin/password123
3. Create a new task
4. Go back to DB Browser
5. Click "Refresh" button
6. See your new task appear!

#### **Try These Actions:**
- Create task → See INSERT in database
- Edit task status → See UPDATE in database  
- Delete task → See row disappear from database
- Register new user → See new row in users table

---

## 🔧 DATABASE TROUBLESHOOTING

### **Common Issues:**

#### **"Database file not found"**
**Cause:** Backend server hasn't been started yet
**Solution:**
```bash
cd backend
npm run dev
# Wait for "Server running" message
# Database file will be created automatically
```

#### **"No data in tables"**
**Cause:** Sample data insertion failed
**Solution:**
```bash
# Delete database and restart
rm backend/database.sqlite
cd backend
npm run dev
# Fresh database with sample data will be created
```

#### **"Cannot open database file"**
**Cause:** File permissions or corruption
**Solution:**
```bash
# Check if file exists
ls -la backend/database.sqlite

# If corrupted, delete and recreate
rm backend/database.sqlite
# Restart backend server
```

#### **"Foreign key constraint failed"**
**Cause:** Trying to create task for non-existent user
**Solution:** Make sure user_id in tasks corresponds to existing user

---

## 🧪 DATABASE EXPERIMENTS

### **Experiment 1: Manual Data Entry**

#### **Add a New User via SQL:**
```sql
INSERT INTO users (username, email, password) 
VALUES ('testuser', 'test@example.com', '$2a$10$dummyHashedPassword');
```

#### **Add Tasks for New User:**
```sql
INSERT INTO tasks (title, description, status, priority, user_id) 
VALUES ('Test Task', 'This is a test', 'pending', 'medium', 2);
```

### **Experiment 2: Data Analysis**

#### **Find Most Active User:**
```sql
SELECT u.username, COUNT(t.id) as task_count
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id
GROUP BY u.id, u.username
ORDER BY task_count DESC;
```

#### **Find Overdue Tasks (if you add due_date):**
```sql
SELECT title, description, created_at
FROM tasks 
WHERE status != 'completed' 
AND created_at < datetime('now', '-7 days');
```

#### **Get Task Statistics:**
```sql
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM tasks), 2) as percentage
FROM tasks 
GROUP BY status;
```

---

## 🎯 ADVANCED DATABASE CONCEPTS

### **Indexes (Performance):**
```sql
-- Add index for faster user lookups
CREATE INDEX idx_users_username ON users(username);

-- Add index for faster task filtering
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
```

### **Triggers (Automatic Actions):**
```sql
-- Automatically update updated_at when task changes
CREATE TRIGGER update_task_timestamp 
AFTER UPDATE ON tasks
FOR EACH ROW
BEGIN
    UPDATE tasks SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

### **Views (Virtual Tables):**
```sql
-- Create view combining user and task data
CREATE VIEW user_task_summary AS
SELECT 
    u.username,
    u.email,
    COUNT(t.id) as total_tasks,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_tasks
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id
GROUP BY u.id, u.username, u.email;
```

---

## 📈 DATABASE BEST PRACTICES

### **Security:**
- ✅ Passwords are hashed (never stored as plain text)
- ✅ SQL injection prevented with parameterized queries
- ✅ User authorization (users can only see their own tasks)

### **Performance:**
- ✅ Indexes on frequently queried columns
- ✅ LIMIT clauses to prevent large result sets
- ✅ Proper foreign key relationships

### **Data Integrity:**
- ✅ NOT NULL constraints on required fields
- ✅ UNIQUE constraints on usernames/emails
- ✅ Foreign key constraints maintain relationships
- ✅ Default values for optional fields

---

## 🔄 BACKUP AND RECOVERY

### **Manual Backup:**
```bash
# Copy database file
cp backend/database.sqlite backend/database_backup_$(date +%Y%m%d).sqlite
```

### **Automated Backup Script:**
```bash
#!/bin/bash
# Create timestamped backup
backup_file="backend/database_backup_$(date +%Y%m%d_%H%M%S).sqlite"
cp backend/database.sqlite "$backup_file"
echo "Database backed up to: $backup_file"
```

### **Restore from Backup:**
```bash
# Stop backend server first
# Replace current database with backup
cp backend/database_backup_20250919.sqlite backend/database.sqlite
# Restart backend server
```

---

## ✅ DATABASE MASTERY CHECKLIST

After studying this guide, you should be able to:

**Basic Level:**
- [ ] Locate the database file on your computer
- [ ] Open database with DB Browser for SQLite
- [ ] View users and tasks tables
- [ ] Understand the relationship between tables

**Intermediate Level:**
- [ ] Write basic SQL queries (SELECT, INSERT, UPDATE, DELETE)
- [ ] Add new users and tasks via SQL
- [ ] Understand foreign key relationships
- [ ] Use command line SQLite tools

**Advanced Level:**
- [ ] Create indexes for performance
- [ ] Write complex JOIN queries
- [ ] Understand database normalization
- [ ] Implement backup and recovery procedures

**Expert Level:**
- [ ] Optimize database performance
- [ ] Design new table structures
- [ ] Implement database migrations
- [ ] Set up database monitoring and alerting

---

## 🎓 NEXT STEPS

### **Database Evolution Path:**
1. **Current**: SQLite (file-based, perfect for learning)
2. **Next**: PostgreSQL (production-ready, full features)
3. **Enterprise**: Distributed databases (MongoDB, Cassandra)
4. **Cloud**: Database-as-a-Service (AWS RDS, Azure SQL)

### **Related Skills to Learn:**
- Database design and normalization
- SQL query optimization
- Database administration
- Data modeling
- Database security
- Backup and disaster recovery

Remember: Understanding how data flows from your application to the database and back is fundamental to DevOps engineering. This knowledge helps you troubleshoot issues, optimize performance, and ensure data integrity in production systems!
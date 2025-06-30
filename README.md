# 📝 To-Do List App (Fullstack)

A full-featured **To-Do List** web application built with:

- 🧠 **ReactJS (Frontend)**
- 🚀 **Node.js + Express (todo_app)**
- 🗄️ **PostgreSQL (Database)**
- 🔐 **JWT Authentication**
- 📆 Support for Due Dates, Filtering, Sorting, Inline Editing

---

## 📸 Preview

| 📝 Register 🔐 Login |
|------------------------|--|--|
| ![](./Project_Preview/Register.png) | ![](./Project_Preview/Register_success.png) | | ![](./Project_Preview/Login.png) |

| ➕ Add Task | |
|-------------|--|
| ![](./Project_Preview/Add_1.png) | ![](./Project_Preview/Add_2.png) |

| ✏️ Edit Task | |
|--------------|--|
| ![](./Project_Preview/Edit_1.png) | ![](./Project_Preview/Edit_2.png) |

| ❌ Delete Task | |
|----------------|--|
| ![](./Project_Preview/Delete_1.png) | ![](./Project_Preview/Delete_2.png) |

| 🔍 Search & Filter | | |
|--------------------|--|--|
| ![](./Project_Preview/Search.png) | ![](./Project_Preview/Filter_Complete.png) | ![](./Project_Preview/Filter_Not_Complete.png) |

| 👤 User Profile |
|-----------------|--|--|
| ![](./Project_Preview/User_1.png) | ![](./Project_Preview/User_2.png) | ![](./Project_Preview/User_3.png) |

| 👤 User Profile |
|-----------------|
| ![](./Project_Preview/Profile.png) |

---

## ⚙️ Features

- ✅ Register / Login with email + password  
- 🔐 Authenticated routes with JWT  
- ➕ Create, ✏️ Edit, ✅ Complete, ❌ Delete tasks  
- 📅 Set due dates  
- 🔍 Search, 📊 Filter by status, 📂 Sort by title or due date  
- 👤 Profile page (change password, update email)  
- 🎨 Responsive UI with TailwindCSS + Lucide Icons  

---

## 🗂️ Project Structure

```
📦 project-root
├── todo_app
│   ├── index.js                # Express API
│   ├── db.js                   # PostgreSQL pool
│   ├── authMiddleware.js       # JWT Auth middleware
│   ├── db/
│   │   ├── schema.sql          # PostgreSQL schema
│   │   └── seed.sql            # Optional: test data
│   ├── .env.example
│   └── ...
├── todo-frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Login, Register, TaskList, etc.
│   │   ├── hooks/              # useAppLogic.js
│   │   ├── services/           # api.js (axios)
│   │   └── App.js
│   └── ...
├── README.md
└── .gitignore
```

---

## 🚀 Getting Started

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/your-username/todo-fullstack-app.git
cd todo-fullstack-app
```

---

### 2. 🛠️ Setup todo_app (Express + PostgreSQL)

#### 2.1 🧱 Create PostgreSQL Database

Make sure PostgreSQL is installed and running.  
Create a new database (e.g. `tododb`) using pgAdmin or psql.

##### Option A: Using pgAdmin

- Open your database in pgAdmin  
- Go to **Query Tool**  
- Load and execute `todo_app/db/schema.sql`  

##### Option B: Using terminal

```bash
psql -U your_username -d tododb -f todo_app/db/schema.sql
```

> Replace `your_username` and `tododb` with your actual credentials.

---

#### 2.2 🔐 Configure Environment Variables

Copy the example file and edit values:

```bash
cp todo_app/.env.example todo_app/.env
```

Edit `todo_app/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/tododb
JWT_SECRET=your_super_secret_key
```

---

#### 2.3 📦 Install Dependencies & Start todo_app

```bash
cd todo_app
npm install
npm start
```

If successful, you should see:

```
Server running at http://localhost:3000
```

---

### 3. 🖥️ Setup Frontend (React)

```bash
cd ../todo-frontend
npm install
npm run dev
```

The app will be available at:  
[http://localhost:5173](http://localhost:5173)

---

### 🧪 Test Credentials (Optional)

If `seed.sql` is provided and imported:

```
Email: demo@example.com  
Password: demo123

Email: user112@example.com	
Password: password1234

Email: demo@example.com	
Password: demo4567

Email: test56565@example.com
Password: test1234
```

---

### 📌 Notes

- Ensure both frontend (`:5173`) and todo_app (`:3000`) are running.
- You may need to update `vite.config.js` or proxy settings if the todo_app URL is different.

---

## 📄 License

MIT License © 2025 Your Name

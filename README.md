
# 📚 Learning Management System (LMS) | MERN Stack

A full-featured Learning Management System (LMS) web application built using the **MERN stack**.  
Designed to help admins and educators manage courses, users, and materials efficiently while providing a clean and interactive learning interface for students.

This project includes advanced features like role-based access control, secure file uploads, and JWT-based authentication.

---

## 🚀 Live Demo

- 🔗 **Live on**: [Live on](https://e-learning-website-by-ganesh.netlify.app/)

---

## 📌 Key Features

### 👤 Authentication & Authorization
- Secure **JWT-based login/signup**
- **Role-based access** (Admin / Instructor / Student)
- Protected routes for different user roles

### 🧾 Course & User Management
- CRUD operations for:
  - Courses
  - Lessons
  - Users (by admin)
- Dynamic dashboards based on user role

### 🗃️ File Handling
- Integrated **Multer** middleware for uploading PDFs, videos, and images
- Stored and served securely for lessons/resources

### 🔐 Backend Highlights
- Passwords hashed using **bcrypt.js**
- **MongoDB** schema design for scalable content hierarchy
- Data validation using middleware and schema constraints

### 📦 Frontend Highlights
- Built with **React.js**, fully componentized structure
- Dashboard-style interface with conditional rendering
- Custom modals, alerts, and user feedback for key actions
- Mobile-friendly & responsive layout

### 📈 Performance & Optimization
- Indexed MongoDB queries for improved data fetch time
- Optimized state management with minimal re-renders

---

## 🛠️ Tech Stack

| Layer        | Technology                     |
|--------------|--------------------------------|
| Frontend     | React.js, Axios, CSS Modules   |
| Backend      | Node.js, Express.js            |
| Database     | MongoDB + Mongoose             |
| Auth         | JWT + bcrypt                   |
| File Uploads | Multer                         |
| Hosting      | Vercel (frontend) + Render (backend) |

---

## 📂 Project Structure

```

lms-project/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.js
├── frontend/
│   ├── components/
│   ├── pages/
│   └── App.js
├── public/
│   └── resume.pdf
└── README.md

````

---

## 🧪 Run the Project Locally

### 🔧 1. Clone the Repo

```bash
git clone https://github.com/ganeshbelote/LMS_Project_MERN
cd lms-project
````

### 🖥 2. Setup Backend

```bash
cd backend
npm install
```

#### Create `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

```bash
npm run dev
```

### 🌐 3. Setup Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Now, the app should be running at:
Frontend → `http://localhost:3000`
Backend → `http://localhost:5000`

---

## 🧠 Unique Business Logic

### ✅ Admin Role

* Can manage users, block/unblock accounts, upload resources, and monitor learning activity

### ✅ Instructor Role

* Can create/edit courses and lessons
* View enrolled students and content performance

### ✅ Student Role

* Can view enrolled courses, mark lessons as completed, and download resources

---

## 🧠 Challenges Faced

* Designing role-specific dashboard logic
* Managing secure file uploads
* Implementing real-time validation for forms and inputs
* Modularizing the backend for scalability

---

## ✅ What I Learned

* Structuring a scalable MERN application
* Managing real-world authentication and access flow
* How to implement file storage securely
* Advanced Express middleware for validation and control


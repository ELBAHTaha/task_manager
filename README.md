🗂️ Task Manager – Full Stack Application

A full-stack task management system built with Spring Boot, PostgreSQL, and React.
The application allows users to authenticate securely, manage projects, track tasks, and visualize progress with a modern UI.

This project demonstrates backend security, REST APIs, database integration, and frontend state management — suitable for internships, junior developer roles, and academic projects.

🚀 Features
🔐 Authentication & Security

JWT-based authentication

Secure password hashing with BCrypt

Protected API endpoints using Spring Security

📁 Project Management

Create, view, and delete projects

Each project belongs to the authenticated user

Project progress tracking

✅ Task Management

CRUD operations on tasks

Assign tasks to projects

Mark tasks as completed

Due date support

📊 Progress Tracking

Automatic progress calculation

Visual progress bar per project

Percentage based on completed tasks

🎨 Frontend

Modern React UI (Vite + Tailwind CSS)

Responsive layout

Login form with validation

Project & task dashboards

🧱 Tech Stack
Backend

Java 17

Spring Boot 3

Spring Security (JWT)

Spring Data JPA

PostgreSQL

Hibernate

Frontend

React

Vite

Axios

React Router

Tailwind CSS

Tools

Maven

Git & GitHub

Postman

📂 Project Structure
task-manager/
├── src/                     # Spring Boot backend
│   ├── main/
│   │   ├── java/com/taskmanager
│   │   └── resources/
│   └── test/
│
├── task-manager-frontend/   # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── pom.xml
├── mvnw / mvnw.cmd
└── README.md

⚙️ Setup & Installation
1️⃣ Prerequisites

Java 17+

Node.js 18+

PostgreSQL

Git

2️⃣ Backend Setup (Spring Boot)
Create database
CREATE DATABASE task_manager;

Configure database credentials

Edit application.yml or use environment variables:

spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/task_manager
    username: postgres
    password: your_password

Run backend
./mvnw spring-boot:run


Backend runs on:

http://localhost:8081

3️⃣ Frontend Setup (React)
cd task-manager-frontend
npm install
npm run dev


Frontend runs on:

http://localhost:5173

🔑 Default Test User

A test user is auto-created at startup:

Email:    admin@test.com
Password: password123

🔌 API Overview
Authentication
POST /auth/login

Projects
GET    /projects
POST   /projects
GET    /projects/{id}
GET    /projects/{id}/progress

Tasks
GET    /projects/{id}/tasks
POST   /projects/{id}/tasks
PUT    /tasks/{id}/complete
DELETE /tasks/{id}


🔐 All endpoints (except /auth/login) require:

Authorization: Bearer <JWT_TOKEN>

🧪 Testing

API tested with Postman

Frontend tested via browser

JWT validation confirmed for protected routes

📈 Future Improvements

User registration

Role-based access (Admin/User)

Drag & drop task ordering

Project deadlines

Charts & analytics dashboard

Docker support

👨‍💻 Author

Taha Elb
Computer Engineering Student
Interested in Backend Development, AI & Full-Stack Systems

📫 GitHub: https://github.com/YOUR_USERNAME

⭐ Why This Project Matters

This project showcases:

Real-world backend security

Clean REST architecture

Full authentication flow

Frontend-backend integration

Production-ready structure

Perfect for:

Internships

Junior developer roles

Academic evaluation

Portfolio showcase

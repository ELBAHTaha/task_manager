<<<<<<< HEAD
# Task Manager
=======

# Task Manager - Portfolio-Ready Full-Stack Application
>>>>>>> 3353f63ff29e3f46577c697c483fcec495ea161b

Full-stack task management app with:
- `backend/`: Spring Boot + PostgreSQL + JWT
- `frontend/`: React + Vite

## Project Structure

<<<<<<< HEAD
```text
.
|- backend/
|- frontend/
|- docker-compose.yml
|- .env.example
=======
This is a complete task management system designed to showcase modern web development skills. It demonstrates proficiency in both frontend and backend technologies, making it perfect for portfolios, job applications, and real-world use.
Short Demo Video: [(https://www.youtube.com/watch?v=tGYPGvWN0qs)](https://www.youtube.com/watch?v=tGYPGvWN0qs)
## ✨ Key Features

### 🔐 Authentication & Security
- JWT-based authentication with automatic token refresh
- Protected routes and role-based access control
- Automatic logout on token expiration
- Secure token storage and validation

### 📊 Dashboard & Analytics
- **Dashboard Overview**: Real-time statistics display
- **Project Metrics**: Total projects, tasks, completion rates
- **Progress Tracking**: Visual progress bars with percentages
- **Quick Actions**: Easy navigation to key features

### 📋 Project Management
- **Project Creation**: Create projects with titles and descriptions
- **Progress Visualization**: Real-time progress tracking for each project
- **Project Cards**: Beautiful card-based layout with progress indicators
- **Empty States**: Friendly messages when no projects exist

### ✅ Advanced Task Management
- **Task CRUD Operations**: Create, read, update, and delete tasks
- **Status Management**: Pending and completed task states
- **Due Date Tracking**: Visual due date indicators with overdue alerts
- **Task Filtering**: Filter by All, Pending, or Completed tasks
- **Inline Completion**: Check off tasks without page reload
- **Confirmation Modals**: Safe deletion with confirmation dialogs

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach, works on all screen sizes
- **Tailwind CSS**: Modern, clean styling with consistent design system
- **Interactive Components**: Hover effects, loading states, animations
- **Status Badges**: Visual indicators for task completion status
- **Progress Bars**: Animated progress indicators with gradient effects
- **Loading States**: Skeleton loaders and spinners for better UX
- **Error Handling**: Graceful error messages and fallback UI

### 🔧 Technical Excellence
- **Error Boundaries**: Graceful error handling with detailed debugging
- **Loading Management**: Smart loading states throughout the application
- **API Integration**: Robust API service with error handling
- **Token Management**: Automatic token expiration handling
- **Component Architecture**: Reusable, modular component design
- **TypeScript-Ready**: Clean JavaScript with modern ES6+ features

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Java 11+ (for backend)
- Maven (for backend)

### Backend Setup
1. Navigate to the project root directory
2. Start the Spring Boot backend:
   ```bash
   mvn spring-boot:run
   ```
3. Backend runs on `http://localhost:8081`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd task-manager-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

### Default Login
- **Email**: `admin@test.com`
- **Password**: `password123`

## 🏗️ Project Structure

```
task-manager-frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ConfirmModal.jsx     # Confirmation dialogs
│   │   ├── ErrorBoundary.jsx    # Error handling
│   │   ├── ErrorMessage.jsx     # Error display
│   │   ├── LoadingSpinner.jsx   # Loading indicators
│   │   ├── Navbar.jsx           # Navigation bar
│   │   ├── ProgressBar.jsx      # Progress visualization
│   │   ├── ProjectCard.jsx      # Project display cards
│   │   └── TaskCard.jsx         # Task display cards
│   ├── context/
│   │   └── AuthContext.jsx      # Authentication state management
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Main dashboard
│   │   ├── LoginPage.jsx        # Authentication
│   │   ├── ProjectDetailPage.jsx # Project details & tasks
│   │   └── ProjectsPage.jsx     # Projects listing
│   ├── services/
│   │   └── api.js               # API integration
│   └── App.jsx                  # Main app component
>>>>>>> 3353f63ff29e3f46577c697c483fcec495ea161b
```

## Prerequisites (Local)

- Node.js 20+
- npm 9+
- Java 17+
- Maven 3.9+
- PostgreSQL 15+

<<<<<<< HEAD
## Quick Start (Docker)
=======
### Interactive Elements
- **Task Checkboxes**: Click to complete/uncomplete tasks
- **Filter Buttons**: Switch between All/Pending/Completed views
- **Progress Bars**: Animated progress indicators
- **Status Badges**: Visual task status indicators
- **Confirmation Modals**: Safe deletion workflows

### Responsive Design Features
- Mobile-first approach
- Collapsible navigation
- Adaptive grid layouts
- Touch-friendly interactions
- Optimized for tablets and phones

## 🔧 Technical Implementation

### State Management
- React Context for global authentication state
- Local state management for component-specific data
- Optimistic updates for better user experience

### API Integration
- Axios-based HTTP client with interceptors
- Automatic token attachment to requests
- Error handling with user-friendly messages
- Token expiration handling with auto-logout

### Security Features
- JWT token validation
- Automatic token expiration checking
- Protected route components
- Secure token storage in localStorage

### Performance Optimizations
- Lazy loading components
- Efficient re-rendering with proper key props
- Optimized bundle size with Vite
- Cached API responses where appropriate

## 📱 Mobile Experience

The application is fully responsive and provides an excellent mobile experience:

- **Touch-Friendly Interface**: Large tap targets and intuitive gestures
- **Responsive Navigation**: Collapsible mobile menu
- **Optimized Forms**: Mobile-friendly form inputs
- **Adaptive Layouts**: Content adapts to screen size
- **Performance**: Fast loading on mobile networks

## 🚀 Deployment Ready

### Production Build
```bash
npm run build
```

### Environment Configuration
- Development and production environment support
- Configurable API base URLs
- Environment-specific error handling

## 🧪 Quality Assurance

### Error Handling
- Global error boundary for React errors
- API error handling with user-friendly messages
- Form validation with helpful feedback
- Network error handling with retry options

### User Experience
- Loading states for all async operations
- Empty states with helpful guidance
- Confirmation dialogs for destructive actions
- Responsive design for all screen sizes

## 📈 Portfolio Highlights

This project demonstrates:

### Frontend Skills
- ⚛️ **React & Modern JavaScript**: Hooks, Context API, ES6+
- 🎨 **CSS & Styling**: Tailwind CSS, responsive design, animations
- 🔧 **Build Tools**: Vite, modern JavaScript tooling
- 📱 **UX/UI Design**: Mobile-first, accessible, intuitive interface
- 🧪 **Error Handling**: Comprehensive error boundaries and validation

### Backend Integration
- 🔌 **API Integration**: RESTful API consumption
- 🔐 **Authentication**: JWT token management
- 📊 **Data Management**: CRUD operations, state synchronization

### Software Engineering
- 📁 **Project Structure**: Clean, maintainable codebase
- 🔄 **State Management**: Efficient data flow
- 🧩 **Component Architecture**: Reusable, modular components
- 🎯 **Performance**: Optimized rendering and network requests

## 🎓 Skills Demonstrated

- **Frontend Development**: React, JavaScript, CSS, Responsive Design
- **API Integration**: REST APIs, Authentication, Error Handling
- **UI/UX Design**: Modern interface design, user experience optimization
- **State Management**: Context API, local state management
- **Project Architecture**: Component organization, code structure
- **Quality Assurance**: Error handling, user feedback, testing considerations

## 🔮 Future Enhancements

- **Real-time Updates**: WebSocket integration for live updates
- **Advanced Filtering**: Search, sorting, and advanced filter options
- **File Attachments**: Task file upload and management
- **Team Collaboration**: Multi-user support and permissions
- **Notifications**: Email and push notification system
- **Analytics**: Detailed productivity analytics and reports

---


This project showcases modern web development practices and real-world application development skills.
=======
# Task Manager - Full Stack Application

A comprehensive task management system built with Spring Boot, React, and PostgreSQL, featuring JWT authentication, clean architecture, and Docker containerization.

## 🚀 Quick Start

**One-command setup:**
>>>>>>> 3353f63ff29e3f46577c697c483fcec495ea161b

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend: http://localhost:8081
- Health: http://localhost:8081/actuator/health

Default login:
- Email: `admin@test.com`
- Password: `password123`

## Local Development

1. Create environment file in project root:

```bash
cp .env.example .env
```

2. Start PostgreSQL (Docker example):

```bash
docker run --name taskmanager-db -e POSTGRES_DB=taskmanager -e POSTGRES_USER=taskmanager -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15-alpine
```

3. Run backend:

```bash
cd backend
mvn spring-boot:run
```

4. Run frontend:

```bash
cd frontend
npm install
npm run dev
```

## Useful Commands

Backend:

```bash
cd backend
mvn -DskipTests compile
mvn test
```

Frontend:

```bash
cd frontend
npm run build
npm test
<<<<<<< HEAD
```
=======
```

Run tests with coverage:
```bash
npm run test:coverage
```

## 🚢 Deployment

### Docker Production Deployment

1. **Build production images:**
   ```bash
   docker compose -f docker-compose.yml build
   ```

2. **Deploy to production:**
   ```bash
   # Set production environment variables
   export DB_PASSWORD=your-secure-password
   export JWT_SECRET=your-jwt-secret-key
   
   docker compose up -d
   ```

### Manual Deployment

1. **Build backend:**
   ```bash
   cd backend
   ./mvnw clean package -DskipTests
   ```

2. **Build frontend:**
   ```bash
   cd frontend
   npm install
   npm run build
   ```

3. **Deploy artifacts to your server**

## ⚙️ Environment Variables

Key environment variables (see `.env.example` for complete list):

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_NAME` | taskmanager | PostgreSQL database name |
| `DB_USERNAME` | taskmanager | Database username |
| `DB_PASSWORD` | password | Database password |
| `JWT_SECRET` | (generated) | JWT signing secret |
| `BACKEND_PORT` | 8081 | Backend server port |
| `FRONTEND_PORT` | 5173 | Frontend server port |
| `VITE_API_BASE_URL` | http://localhost:8081 | Backend API URL for frontend |
| `CORS_ALLOWED_ORIGINS` | http://localhost:5173 | Allowed CORS origins |

## 🔍 Troubleshooting

### Common Issues

**1. Docker containers fail to start**
```bash
# Check logs
docker compose logs

# Restart services
docker compose down
docker compose up --build
```

**2. Database connection issues**
```bash
# Check if database is running
docker compose ps

# Check database logs
docker logs taskmanager-db
```

**3. Frontend can't reach backend**
- Verify `VITE_API_BASE_URL` in your environment
- Check CORS configuration in backend
- Ensure backend health check passes: http://localhost:8081/actuator/health

**4. Authentication issues**
- Verify JWT secret is properly set
- Check if user exists in database
- Try default credentials: admin@test.com / password123

**5. Port conflicts**
```bash
# Change ports in .env file or docker-compose.yml
# Default ports: 5173 (frontend), 8081 (backend), 5432 (database)
```

### Health Checks

Monitor service health:
```bash
# Check all services
docker compose ps

# Check specific service logs
docker logs taskmanager-backend
docker logs taskmanager-frontend
docker logs taskmanager-db

# Test backend health
curl http://localhost:8081/actuator/health

# Test frontend
curl http://localhost:5173/health
```

### Development Tips

1. **Hot reload not working?**
   - Ensure proper volume mounting in docker-compose.yml
   - Check file permissions
   - Restart the development container

2. **Database schema issues?**
   - The application uses `hibernate.ddl-auto=update`
   - For fresh start: `docker compose down -v` then `docker compose up`

3. **CORS issues in development?**
   - Frontend proxy configuration in vite.config.js
   - Backend CORS settings in SecurityConfig.java


## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the [Troubleshooting](#troubleshooting) section
2. Review the logs using `docker compose logs`
3. Open an issue with detailed error information

---


**Status**: ✅ Production Ready | 🐳 Fully Dockerized | 🔒 Secure | 📱 Responsive

>>>>>>> 3353f63ff29e3f46577c697c483fcec495ea161b

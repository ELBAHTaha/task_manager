# Task Manager - Portfolio-Ready Full-Stack Application

A professional task management application built with React + Vite frontend and Spring Boot backend, featuring JWT authentication and a modern, responsive UI.

## 🎯 Project Overview

This is a complete task management system designed to showcase modern web development skills. It demonstrates proficiency in both frontend and backend technologies, making it perfect for portfolios, job applications, and real-world use.

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
```

## 🎨 UI Components

### Dashboard Cards
- **Total Projects**: Count of all projects
- **Total Tasks**: Count of all tasks across projects
- **Completed Tasks**: Number of finished tasks
- **Overall Progress**: Percentage of completion across all projects

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

**Perfect for**: Junior to Mid-level Developer positions, Full-stack roles, Frontend specializations, and portfolio demonstrations.

This project showcases modern web development practices and real-world application development skills.
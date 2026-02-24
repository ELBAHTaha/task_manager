# Task Manager

Full-stack task management app with:
- `backend/`: Spring Boot + PostgreSQL + JWT
- `frontend/`: React + Vite

## Project Structure

```text
.
|- backend/
|- frontend/
|- docker-compose.yml
|- .env.example
```

## Prerequisites (Local)

- Node.js 20+
- npm 9+
- Java 17+
- Maven 3.9+
- PostgreSQL 15+

## Quick Start (Docker)

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
```
# Docker Setup Guide

This guide explains how to set up and run the Task Manager application using Docker and Docker Compose.

## Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)
- Git (for cloning the repository)

## Quick Start

1. Clone the repository:
```bash
git clone <repository-url>
cd hahn
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the application:
```bash
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8081
- pgAdmin (optional): http://localhost:5050

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DB_NAME=taskmanager
DB_USERNAME=taskmanager
DB_PASSWORD=secure_password_here
DB_HOST=database
DB_PORT=5432

# Backend Configuration
BACKEND_PORT=8081
SPRING_PROFILES_ACTIVE=docker

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_at_least_32_characters_long
JWT_EXPIRATION=86400000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Frontend Configuration
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:8081

# pgAdmin Configuration (optional)
PGADMIN_EMAIL=admin@taskmanager.com
PGADMIN_PASSWORD=admin_password_here
PGADMIN_PORT=5050
```

### Security Considerations

**Important**: Change the default passwords and secrets before deploying to production:

- `DB_PASSWORD`: Use a strong database password
- `JWT_SECRET`: Generate a secure random string (at least 32 characters)
- `PGADMIN_PASSWORD`: Set a secure admin password

## Services

### Database (PostgreSQL)
- **Port**: 5432
- **Container**: `taskmanager-db`
- **Volume**: `postgres_data` (persistent storage)
- **Health Check**: Automatic database readiness check

### Backend (Spring Boot)
- **Port**: 8081
- **Container**: `taskmanager-backend`
- **Dependencies**: Database service
- **Health Check**: Spring Boot Actuator health endpoint

### Frontend (React)
- **Port**: 5173
- **Container**: `taskmanager-frontend`
- **Dependencies**: Backend service
- **Server**: Nginx (production-ready)

### pgAdmin (Optional)
- **Port**: 5050
- **Container**: `taskmanager-pgadmin`
- **Profile**: `tools` (not started by default)

## Docker Commands

### Basic Operations

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart backend

# View service status
docker-compose ps
```

### Development Commands

```bash
# Build and start (useful after code changes)
docker-compose up -d --build

# Start with pgAdmin
docker-compose --profile tools up -d

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f database
```

### Data Management

```bash
# Remove all containers and volumes (DESTRUCTIVE)
docker-compose down -v

# Backup database
docker exec taskmanager-db pg_dump -U taskmanager taskmanager > backup.sql

# Restore database
docker exec -i taskmanager-db psql -U taskmanager taskmanager < backup.sql
```

## Volumes

The following Docker volumes are created for persistent data:

- `postgres_data`: Database files
- `pgadmin_data`: pgAdmin configuration and settings

## Networking

All services communicate through the `taskmanager-network` bridge network:

- Services can reach each other using container names
- Backend connects to database using hostname `database`
- Frontend connects to backend using configured API URL

## Database Initialization

The database is automatically initialized with:

- Required tables (users, projects, tasks)
- Database indexes for performance
- Default admin user: `admin@test.com` / `password123`
- Sample projects and tasks
- Database triggers for timestamps

## Health Checks

All services include health checks:

- **Database**: PostgreSQL readiness check
- **Backend**: Spring Boot Actuator health endpoint
- **Frontend**: Nginx server response check

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check if ports are in use
   netstat -tlnp | grep :8081
   netstat -tlnp | grep :5173
   netstat -tlnp | grep :5432
   ```

2. **Database connection issues**:
   ```bash
   # Check database logs
   docker-compose logs database
   
   # Test database connection
   docker exec -it taskmanager-db psql -U taskmanager -d taskmanager
   ```

3. **Backend not starting**:
   ```bash
   # Check backend logs
   docker-compose logs backend
   
   # Verify environment variables
   docker exec taskmanager-backend env | grep SPRING
   ```

4. **Frontend not accessible**:
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   
   # Verify Nginx configuration
   docker exec taskmanager-frontend nginx -t
   ```

### Service Dependencies

Services start in this order:
1. Database (with health check)
2. Backend (waits for database)
3. Frontend (waits for backend)
4. pgAdmin (optional, waits for database)

### Log Locations

- Backend logs: Available via `docker-compose logs backend`
- Frontend logs: Available via `docker-compose logs frontend`
- Database logs: Available via `docker-compose logs database`
- Application logs: Mounted to `./logs` directory

## Development Workflow

### Local Development with Docker

1. **Start services**:
   ```bash
   docker-compose up -d database
   ```

2. **Run backend locally**:
   - Set `SPRING_PROFILES_ACTIVE=local` in your IDE
   - Configure database connection to `localhost:5432`

3. **Run frontend locally**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Hot Reload (Development)

For development with hot reload, use volume mounts:

```yaml
# Add to docker-compose.yml frontend service
volumes:
  - ./frontend/src:/app/src
  - ./frontend/public:/app/public
```

## Production Deployment

### Production Environment Variables

```env
# Use secure values in production
DB_PASSWORD=very_secure_production_password
JWT_SECRET=production_jwt_secret_at_least_64_characters_long
SPRING_PROFILES_ACTIVE=prod
DEBUG=false
```

### Security Hardening

1. **Change default credentials**
2. **Use secrets management** (Docker Secrets, Kubernetes Secrets)
3. **Enable HTTPS** (add reverse proxy like Traefik or Nginx)
4. **Restrict network access**
5. **Regular security updates**

### Scaling

```bash
# Scale backend service
docker-compose up -d --scale backend=3

# Use load balancer (add to docker-compose.yml)
# nginx:
#   image: nginx:alpine
#   ports:
#     - "80:80"
#   depends_on:
#     - backend
```

## pgAdmin Usage

When started with the `tools` profile:

1. Access: http://localhost:5050
2. Login with credentials from `.env` file
3. Add server connection:
   - Host: `database`
   - Port: `5432`
   - Username: From `DB_USERNAME`
   - Password: From `DB_PASSWORD`

## Monitoring

### Health Check Endpoints

- Backend: http://localhost:8081/actuator/health
- Frontend: http://localhost:5173/health
- Database: Connection test via backend health check

### Performance Monitoring

```bash
# Resource usage
docker stats

# Container resource limits
docker-compose config
```

## Backup and Recovery

### Automated Backup

Create a backup script:

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="./backups"
DATE=$(date +"%Y%m%d_%H%M%S")

mkdir -p $BACKUP_DIR

# Database backup
docker exec taskmanager-db pg_dump -U taskmanager taskmanager > "$BACKUP_DIR/db_$DATE.sql"

# Application data backup (if needed)
docker run --rm -v postgres_data:/data -v $BACKUP_DIR:/backup alpine tar czf /backup/postgres_data_$DATE.tar.gz -C /data .
```

### Recovery

```bash
# Restore database
docker exec -i taskmanager-db psql -U taskmanager taskmanager < backup.sql

# Restore volume data
docker run --rm -v postgres_data:/data -v ./backups:/backup alpine tar xzf /backup/postgres_data_backup.tar.gz -C /data
```

## Support

For issues and questions:

1. Check the logs: `docker-compose logs`
2. Verify environment configuration
3. Ensure all required ports are available
4. Check Docker and Docker Compose versions

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Spring Boot Docker Guide](https://spring.io/guides/gs/spring-boot-docker/)
- [React Docker Deployment](https://create-react-app.dev/docs/deployment/#docker)
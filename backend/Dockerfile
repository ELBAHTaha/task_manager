# Multi-stage build for Spring Boot backend
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Set working directory
WORKDIR /app

# Copy pom.xml first for dependency caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r taskmanager && useradd -r -g taskmanager taskmanager

# Install wget for health checks
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

# Copy the built jar from build stage
COPY --from=build /app/target/taskmanager-backend-1.0.0.jar app.jar

# Create logs directory
RUN mkdir -p logs && chown -R taskmanager:taskmanager logs

# Change ownership of the app directory
RUN chown -R taskmanager:taskmanager /app

# Switch to non-root user
USER taskmanager

# Expose port
EXPOSE 8081

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "app.jar"]

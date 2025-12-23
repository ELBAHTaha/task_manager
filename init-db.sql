-- Database initialization script for Task Manager
-- This script sets up the initial database structure and data

-- Create database if it doesn't exist (this may not work in all PostgreSQL setups)
-- CREATE DATABASE IF NOT EXISTS taskmanager;

-- Connect to the taskmanager database
\c taskmanager;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    user_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    project_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Insert default user (password is bcrypt hash of "password123")
INSERT INTO users (email, password, first_name, last_name)
VALUES ('admin@test.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'Admin', 'User')
ON CONFLICT (email) DO NOTHING;

-- Insert sample projects for the default user
INSERT INTO projects (title, description, user_id)
SELECT 'Sample Project 1', 'This is a sample project to demonstrate the task management system', u.id
FROM users u WHERE u.email = 'admin@test.com'
ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, user_id)
SELECT 'Personal Tasks', 'Personal tasks and reminders', u.id
FROM users u WHERE u.email = 'admin@test.com'
ON CONFLICT DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (title, description, completed, due_date, project_id)
SELECT 'Setup Development Environment', 'Install and configure all necessary development tools', false, CURRENT_DATE + INTERVAL '7 days', p.id
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'admin@test.com' AND p.title = 'Sample Project 1'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, completed, due_date, project_id)
SELECT 'Write Project Documentation', 'Create comprehensive documentation for the project', false, CURRENT_DATE + INTERVAL '14 days', p.id
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'admin@test.com' AND p.title = 'Sample Project 1'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, completed, due_date, project_id)
SELECT 'Complete Initial Testing', 'Perform initial testing of all features', true, CURRENT_DATE - INTERVAL '2 days', p.id
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'admin@test.com' AND p.title = 'Sample Project 1'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, completed, due_date, project_id)
SELECT 'Buy Groceries', 'Weekly grocery shopping', false, CURRENT_DATE + INTERVAL '2 days', p.id
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'admin@test.com' AND p.title = 'Personal Tasks'
ON CONFLICT DO NOTHING;

INSERT INTO tasks (title, description, completed, due_date, project_id)
SELECT 'Schedule Doctor Appointment', 'Annual health checkup', false, CURRENT_DATE + INTERVAL '30 days', p.id
FROM projects p
JOIN users u ON p.user_id = u.id
WHERE u.email = 'admin@test.com' AND p.title = 'Personal Tasks'
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant appropriate permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON DATABASE taskmanager TO taskmanager;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO taskmanager;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO taskmanager;

-- Display confirmation message
DO $$
BEGIN
    RAISE NOTICE 'Database initialization completed successfully!';
    RAISE NOTICE 'Default user created: admin@test.com (password: password123)';
    RAISE NOTICE 'Sample projects and tasks have been created.';
END $$;

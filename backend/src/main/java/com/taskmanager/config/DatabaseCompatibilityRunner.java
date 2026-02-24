package com.taskmanager.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseCompatibilityRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseCompatibilityRunner.class);
    private static final String DEFAULT_ADMIN_EMAIL = "admin@test.com";
    // BCrypt hash for "password123"
    private static final String DEFAULT_ADMIN_PASSWORD_HASH =
            "$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a";

    private final JdbcTemplate jdbcTemplate;

    public DatabaseCompatibilityRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!tableExists("users")) {
            return;
        }

        ensureUserNameColumnsAreCompatible();
        ensureDefaultAdminUser();
    }

    private void ensureUserNameColumnsAreCompatible() {
        boolean hasFirstNameSnake = columnExists("users", "first_name");
        boolean hasLastNameSnake = columnExists("users", "last_name");

        if (!hasFirstNameSnake) {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN first_name VARCHAR(255)");
        }
        if (!hasLastNameSnake) {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN last_name VARCHAR(255)");
        }

        copyLegacyColumnIfPresent("firstname", "first_name");
        copyLegacyColumnIfPresent("firstName", "first_name");
        copyLegacyColumnIfPresent("lastname", "last_name");
        copyLegacyColumnIfPresent("lastName", "last_name");

        jdbcTemplate.update(
                "UPDATE users SET first_name = COALESCE(first_name, 'User') WHERE first_name IS NULL OR TRIM(first_name) = ''"
        );
        jdbcTemplate.update(
                "UPDATE users SET last_name = COALESCE(last_name, 'User') WHERE last_name IS NULL OR TRIM(last_name) = ''"
        );
    }

    private void copyLegacyColumnIfPresent(String sourceColumn, String targetColumn) {
        if (!columnExists("users", sourceColumn)) {
            return;
        }
        String source = quoteIdentifier(sourceColumn);
        String target = quoteIdentifier(targetColumn);
        jdbcTemplate.update(
                "UPDATE users SET " + target + " = COALESCE(" + target + ", " + source + ") " +
                        "WHERE " + source + " IS NOT NULL"
        );
    }

    private void ensureDefaultAdminUser() {
        Integer existing = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM users WHERE email = ?",
                Integer.class,
                DEFAULT_ADMIN_EMAIL
        );

        if (existing != null && existing > 0) {
            String currentPassword = jdbcTemplate.queryForObject(
                    "SELECT password FROM users WHERE email = ?",
                    String.class,
                    DEFAULT_ADMIN_EMAIL
            );
            if (currentPassword == null || !currentPassword.startsWith("$2")) {
                jdbcTemplate.update(
                        "UPDATE users SET password = ? WHERE email = ?",
                        DEFAULT_ADMIN_PASSWORD_HASH,
                        DEFAULT_ADMIN_EMAIL
                );
                log.info("Updated default admin password hash for {}", DEFAULT_ADMIN_EMAIL);
            }
            return;
        }

        jdbcTemplate.update(
                "INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)",
                DEFAULT_ADMIN_EMAIL,
                DEFAULT_ADMIN_PASSWORD_HASH,
                "Admin",
                "User"
        );

        log.info("Default admin user seeded: {}", DEFAULT_ADMIN_EMAIL);
    }

    private boolean tableExists(String tableName) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ?",
                Integer.class,
                tableName
        );
        return count != null && count > 0;
    }

    private boolean columnExists(String tableName, String columnName) {
        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM information_schema.columns " +
                        "WHERE table_schema = 'public' AND table_name = ? AND column_name = ?",
                Integer.class,
                tableName,
                columnName
        );
        return count != null && count > 0;
    }

    private String quoteIdentifier(String identifier) {
        return "\"" + identifier.replace("\"", "\"\"") + "\"";
    }
}

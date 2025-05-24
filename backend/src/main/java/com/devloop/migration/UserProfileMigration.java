package com.devloop.migration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMigration implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        // Verificar se as colunas já existem
        boolean bioExists = columnExists("users", "bio");
        boolean titleExists = columnExists("users", "title");
        boolean experienceExists = columnExists("users", "experience");
        boolean userSkillsTableExists = tableExists("user_skills");

        // Adicionar colunas se não existirem
        if (!bioExists) {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN bio TEXT");
            System.out.println("Coluna 'bio' adicionada à tabela 'users'");
        }

        if (!titleExists) {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN title VARCHAR(255)");
            System.out.println("Coluna 'title' adicionada à tabela 'users'");
        }

        if (!experienceExists) {
            jdbcTemplate.execute("ALTER TABLE users ADD COLUMN experience TEXT");
            System.out.println("Coluna 'experience' adicionada à tabela 'users'");
        }

        // Criar tabela de habilidades se não existir
        if (!userSkillsTableExists) {
            jdbcTemplate.execute(
                "CREATE TABLE user_skills (" +
                "id BIGINT AUTO_INCREMENT PRIMARY KEY, " +
                "user_id BIGINT NOT NULL, " +
                "skill VARCHAR(255) NOT NULL, " +
                "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                ")"
            );
            System.out.println("Tabela 'user_skills' criada");
        }
    }

    private boolean columnExists(String tableName, String columnName) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS " +
                "WHERE TABLE_NAME = ? AND COLUMN_NAME = ?",
                Integer.class, tableName, columnName
            );
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean tableExists(String tableName) {
        try {
            Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES " +
                "WHERE TABLE_NAME = ?",
                Integer.class, tableName
            );
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }
}

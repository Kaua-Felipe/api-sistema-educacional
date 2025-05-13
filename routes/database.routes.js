import { Router } from "express"
import pool from "../db/db.js"

const router = Router()

/**
 * @openapi
 * /api/v1/createdb:
 *   get:
 *     summary: Cria o banco de dados caso não exista
 *     description: Retorna se o banco de dados foi criado ou se já existia.
 *     responses:
 *       201:
 *         description: Tabelas do banco criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DataBase'
 */

router.get("/", async (req, res) => {
    try {
        const conn = await pool.getConnection()
        await conn.query(`
            SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
            SET time_zone = "+00:00";

            CREATE TABLE IF NOT EXISTS \`alunos\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`birth_date\` date NOT NULL,
                \`approved\` tinyint(1) NOT NULL DEFAULT 0,
                \`id_class\` int(11) NOT NULL, 
                PRIMARY KEY (\`id\`), 
                KEY \`id_class\` (\`id_class\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

            CREATE TABLE IF NOT EXISTS \`instituicoes\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`name\` varchar(50) NOT NULL,
                \`cnpj\` varchar(14) NOT NULL,
                \`cep\` varchar(8) NOT NULL,
                \`address_number\` int(5) NOT NULL,
                \`id_professor\` int(11) NOT NULL, 
                PRIMARY KEY (\`id\`),
                KEY \`id_professor\` (\`id_professor\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

            CREATE TABLE IF NOT EXISTS \`professores\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`name\` varchar(100) NOT NULL,
                \`email\` varchar(50) NOT NULL,
                \`password\` varchar(20) NOT NULL, 
                PRIMARY KEY (\`id\`),
                UNIQUE KEY \`email\` (\`email\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

            INSERT INTO \`professores\` (\`id\`, \`name\`, \`email\`, \`password\`) VALUES
            (1, 'Breno', 'breno@gmail.com', 'breno123'),
            (2, 'Rafael', 'rafael@gmail.com', 'rafael123'),
            (3, 'Aldriano', 'aldriano@gmail.com', 'aldriano123'),
            (4, 'Saulo', 'saulo@gmail.com', 'saulo123'),
            (5, 'Willian', 'willian@gmail.com', 'willian123'),
            (6, 'Pedro', 'pedro1@gmail.com', 'pedro123'),
            (7, 'João', 'joao@gmail.com', 'joao123');

            CREATE TABLE IF NOT EXISTS \`turmas\` (
                \`id\` int(11) NOT NULL AUTO_INCREMENT,
                \`name\` varchar(20) NOT NULL,
                \`school_year\` int(11) NOT NULL,
                \`id_institution\` int(11) NOT NULL, 
                PRIMARY KEY (\`id\`),
                KEY \`id_institution\` (\`id_institution\`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

            ALTER TABLE \`alunos\`
            MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

            ALTER TABLE \`instituicoes\`
            MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

            ALTER TABLE \`professores\`
            MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

            ALTER TABLE \`turmas\`
            MODIFY \`id\` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

            ALTER TABLE \`alunos\`
            ADD CONSTRAINT \`alunos_ibfk_1\` FOREIGN KEY (\`id_class\`) REFERENCES \`turmas\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;

            ALTER TABLE \`instituicoes\`
            ADD CONSTRAINT \`instituicoes_ibfk_1\` FOREIGN KEY (\`id_professor\`) REFERENCES \`professores\` (\`id\`);

            ALTER TABLE \`turmas\`
            ADD CONSTRAINT \`turmas_ibfk_1\` FOREIGN KEY (\`id_institution\`) REFERENCES \`instituicoes\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE;
        `)

        conn.release()
        res.status(201).json({ message: "Banco de dados criado com sucesso." })
    } catch (err) {
        res.status(500).json({ warning: "Banco de dados já está criado." })
    }
});

export default router

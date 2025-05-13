import { Router } from "express"
import pool from "../db/db.js"

const router = Router()

/**
 * @openapi
 * /api/v1/alunos:
 *   get:
 *     summary: Lista todos os alunos
 *     description: Retorna um array de todos os alunos cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Alunos'
 * 
 *   post:
 *     summary: Cria um novo aluno
 *     description: Adiciona um novo aluno ao sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       201:
 *         description: Aluno criado com sucesso
 *       400:
 *         description: Dados inválidos
 *
 * /api/v1/alunos/{id}:
 *   get:
 *     summary: Retorna um aluno pelo ID
 *     description: Retorna os dados de um aluno específico com base no ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do aluno retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Aluno'
 *       404:
 *         description: Aluno não encontrado
 * 
 *   put:
 *     summary: Atualiza os dados de um aluno
 *     description: Atualiza completamente os dados de um aluno existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Aluno não encontrado
 * 
 */
router.get("/", async (req, res) => {
    try {
        const conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM alunos")
        conn.release()
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.post("/", async (req, res) => {
    const { name, birth_date, id_class  } = req.body

    if(!name || !birth_date) {
        return res.status(400).json({ error: "Nome e data de nascimento são obrigatórios." })
    } else if(!id_class) {
        return res.status(400).json({ error: "Para criar um aluno, primeiro deve-se existir uma turma para cadastrá-lo." })
    }

    try {
        const conn = await pool.getConnection()
        const result = await conn.query(
            "INSERT INTO alunos (name, birth_date, id_class) VALUES (?, ?, ?)", 
            [name, birth_date, id_class]
        )
        conn.release()
        res.status(201).json({ id: Number(result.insertId), name, birth_date, id_class })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { name, birth_date, id_class } = req.body
  
    if(!name || !birth_date) {
        return res.status(400).json({ error: "Nome e data de nascimento são obrigatórios." })
    } else if(!id_class) {
        return res.status(400).json({ error: "Para alterar um aluno, primeiro deve-se existir uma turma para realizar as alterações." })
    }
    
    try {
        const conn = await pool.getConnection()
        const result = await conn.query(
            "UPDATE alunos SET name = ?, birth_date = ? WHERE id = ?", 
            [name, birth_date, id]
        )
        conn.release()
        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Aluno não encontrado.' });
        }
        
        res.json({ id, name, birth_date, id_class })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM alunos WHERE id = ?', [id]);
        conn.release();
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Aluno não encontrado.' });
        }
    
        res.json({ message: `Aluno com ID ${id} foi removido com sucesso.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router

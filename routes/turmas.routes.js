import { Router } from "express"
import pool from "../db/db.js"

const router = Router()

/**
 * @openapi
 * /api/v1/turmas:
 *   get:
 *     summary: Lista todas as turmas
 *     description: Retorna um array de todas as turmas cadastradas no sistema onde o professor da aula.
 *     responses:
 *       200:
 *         description: Lista de turmas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Turma'
 * 
 *   post:
 *     summary: Cria uma nova turma
 *     description: Adiciona uma nova turma ao sistema onde o professor da aula.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       201:
 *         description: Turma criada com sucesso
 *       400:
 *         description: Dados inválidos
 *
 * /api/v1/turmas/{id}:
 *   get:
 *     summary: Retorna uma turma pelo ID
 *     description: Retorna os dados de uma turma específica com base no ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da turma retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Turma'
 *       404:
 *         description: Turma não encontrado
 * 
 *   put:
 *     summary: Atualiza os dados de uma turma
 *     description: Atualiza completamente os dados de uma turma existente.
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
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Turma não encontrado
 * 
 */

router.get("/", async (req, res) => {
    try {
        const conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM turmas")
        conn.release()
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.post("/", async (req, res) => {
    const { name, school_year, id_institution } = req.body

    if(!name || !school_year) {
        return res.status(400).json({ error: "Nome e ano letivo são obrigatórios." })
    } else if(!id_institution) {
        return res.status(400).json({ error: "Para criar uma turma, primeiro deve-se existir uma instituição para cadastrá-la." })
    }

    try {
        const conn = await pool.getConnection()
        const result = await conn.query(
            "INSERT INTO turmas (name, school_year, id_institution) VALUES (?, ?, ?)", 
            [name, school_year, id_institution]
        )
        conn.release()
        res.status(201).json({ id: Number(result.insertId), name, school_year, id_institution })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { name, school_year, id_institution } = req.body
  
    if(!name || !school_year) {
        return res.status(400).json({ error: "Nome e ano letivo são obrigatórios." })
    } else if(!id_institution) {
        return res.status(400).json({ error: "Para alterar uma turma, primeiro deve-se existir uma instituição para realizar as alterações." })
    }
    
    try {
        const conn = await pool.getConnection()
        const result = await conn.query(
        "UPDATE turmas SET name = ?, school_year = ? WHERE id = ?", 
        [name, school_year, id]
        )
        conn.release()
        if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Turma não encontrada.' });
        }
        
        res.json({ id, name, school_year, id_institution })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM turmas WHERE id = ?', [id]);
        conn.release();
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Turma não encontrado.' });
        }
    
        res.json({ message: `Turma com ID ${id} e seus respectivos alunos foram removidos com sucesso.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router

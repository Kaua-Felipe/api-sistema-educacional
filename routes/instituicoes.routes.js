import { Router } from "express"
import pool from "../db/db.js"

const router = Router()

/**
 * @openapi
 * /api/v1/instituicoes:
 *   get:
 *     summary: Lista todas as instituições
 *     description: Retorna um array de todas as instituições cadastradas no sistema onde o professor da aula.
 *     responses:
 *       200:
 *         description: Lista de instituições retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Instituicao'
 * 
 *   post:
 *     summary: Cria uma nova instituição
 *     description: Adiciona uma nova instituição ao sistema onde o professor da aula.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Instituicao'
 *     responses:
 *       201:
 *         description: Instituição criada com sucesso
 *       400:
 *         description: Dados inválidos
 *
 * /api/v1/instituicoes/{id}:
 *   get:
 *     summary: Retorna uma instituição pelo ID
 *     description: Retorna os dados de uma instituição específica com base no ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados da instituição retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Instituicao'
 *       404:
 *         description: Instituição não encontrado
 * 
 *   put:
 *     summary: Atualiza os dados de uma instituição
 *     description: Atualiza completamente os dados de uma instituição existente.
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
 *             $ref: '#/components/schemas/Instituicao'
 *     responses:
 *       200:
 *         description: Instituição atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Instituição não encontrado
 * 
 */

router.get("/", async (req, res) => {
    try {
        const conn = await pool.getConnection()
        const rows = await conn.query("SELECT * FROM instituicoes")
        conn.release()
        res.json(rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.post("/", async (req, res) => {
    const { name, cnpj, cep, address_number, id_professor } = req.body

    if(!name || !cnpj || !cep || !address_number) {
        return res.status(400).json({ error: "Nome, cnpj, cep e número de endereço são obrigatórios." })
    } else if(!id_professor) {
        return res.status(400).json({ error: "Para criar uma instituição, primeiro deve-se existir um professor para cadastrá-la." })
    }

    try {
        const conn = await pool.getConnection()
        const result = await conn.query(
            "INSERT INTO instituicoes (name, cnpj, cep, address_number, id_professor) VALUES (?, ?, ?, ?, ?)", 
            [name, cnpj, cep, address_number, id_professor]
        )
        conn.release()
        res.status(201).json({ id: Number(result.insertId), name, cnpj, cep, address_number, id_professor })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.put("/:id", async (req, res) => {
    const { id } = req.params
    const { name, cnpj, cep, address_number, id_professor } = req.body
  
    if(!name || !cnpj || !cep || !address_number) {
        return res.status(400).json({ error: "Nome, cnpj, cep e número de endereço são obrigatórios." })
    } else if(!id_professor) {
        return res.status(400).json({ error: "Para alterar uma instituição, primeiro deve-se existir um professor para realizar as alterações." })
    }
    
    try {
        const conn = await pool.getConnection()
        const result = await conn.query(
            "UPDATE instituicoes SET name = ?, cnpj = ?, cep = ?, address_number = ? WHERE id = ?", 
            [name, cnpj, cep, address_number, id]
        )
        conn.release()
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Instituição não encontrada.' });
        }
        
        res.json({ id, name, cnpj, cep, address_number, id_professor })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});
router.delete("/:id", async (req, res) => {
    const { id } = req.params

    try {
        const conn = await pool.getConnection();
        const result = await conn.query('DELETE FROM instituicoes WHERE id = ?', [id]);
        conn.release();
    
        if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Instituição não encontrado.' });
        }
    
        res.json({ message: `Instituição com ID ${id} e suas respectivas turmas e alunos foram removidos com sucesso.` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router

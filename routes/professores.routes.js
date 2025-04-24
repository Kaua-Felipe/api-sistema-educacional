import { Router } from 'express'
import pool from '../db/db.js'

const router = Router()

/**
 * @openapi
 * /api/v1/professores:
 *   get:
 *     summary: Lista todos os professores
 *     description: Retorna um array de todos os professores cadastrados no sistema.
 *     responses:
 *       200:
 *         description: Lista de professores retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Professor'
 * 
 *   post:
 *     summary: Cria um novo professor
 *     description: Adiciona um novo professor ao sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       201:
 *         description: Professor criado com sucesso
 *       400:
 *         description: Dados inválidos
 *
 * /api/v1/professores/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     description: Retorna os dados de um professor específico com base no ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do professor retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       404:
 *         description: Professor não encontrado
 * 
 *   put:
 *     summary: Atualiza os dados de um professor
 *     description: Atualiza completamente os dados de um professor existente.
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
 *             $ref: '#/components/schemas/Professor'
 *     responses:
 *       200:
 *         description: Professor atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Professor não encontrado
 * 
 */
router.get('/', async (req, res) => {
  try {
    const conn = await pool.getConnection()
    const rows = await conn.query('SELECT id, name, email FROM professores')
    conn.release()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const conn = await pool.getConnection()
    const rows = await conn.query('SELECT * FROM professores WHERE id = ?', [id])
    conn.release()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.post("/", async (req, res) => {
  const { name, email, password } = req.body

  if(!name || !email || !password) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." })
  }
  
  try {
    const conn = await pool.getConnection()
    const result = await conn.query(
      "INSERT INTO professores (name, email, password) VALUES (?, ?, ?)", 
      [name, email, password]
    )
    conn.release()
    res.status(201).json({ id: Number(result.insertId), name, email, password })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});
router.put("/:id", async (req, res) => {
  const { id } = req.params
  const { name, email, password } = req.body

  if(!name || !email || !password) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." })
  }
  
  try {
    const conn = await pool.getConnection()
    const result = await conn.query(
      "UPDATE professores SET name = ?, email = ?, password = ? WHERE id = ?", 
      [name, email, password, id]
    )
    conn.release()
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Professor não encontrado.' });
    }
    
    res.json({ id, name, email, password })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
});

export default router

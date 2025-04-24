import { Router } from "express"
import pool from "../db/db.js"

const router = Router()

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

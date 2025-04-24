import { Router } from "express"
import pool from "../db/db.js"

const router = Router()

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

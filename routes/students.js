const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../basedo");

// Endpoint pour récupérer la liste des étudiants d'une classe
router.get("/", (req, res) => {
    const { classroom_id } = req.params;
    db.all("SELECT * FROM students WHERE classroom_id = ?", [classroom_id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint pour ajouter un étudiant avec vérification d'unicité (déjà présent)
router.post("/", (req, res) => {
    const { classroom_id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(422).json({ error: 'Le paramètre "name" est requis.' });
    }

    db.get("SELECT * FROM students WHERE name = ? AND classroom_id = ?", [name, classroom_id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.status(409).json({ error: 'Un étudiant avec ce nom existe déjà dans cette classe.' });
        } else {
            db.run("INSERT INTO students (name, classroom_id) VALUES (?, ?)", [name, classroom_id], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({ id: this.lastID, name, classroom_id });
                }
            });
        }
    });
});

// Endpoint pour modifier un étudiant avec vérification d'unicité
router.put("/:student_id", (req, res) => {
    const { classroom_id, student_id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(422).json({ error: 'Le paramètre "name" est requis.' });
    }

    db.get("SELECT * FROM students WHERE name = ? AND classroom_id = ? AND id != ?", [name, classroom_id, student_id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (row) {
            res.status(409).json({ error: 'Un étudiant avec ce nom existe déjà dans cette classe.' });
        } else {
            db.run("UPDATE students SET name = ? WHERE id = ? AND classroom_id = ?", [name, student_id, classroom_id], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ id: student_id, name, classroom_id });
                }
            });
        }
    });
});

module.exports = router;

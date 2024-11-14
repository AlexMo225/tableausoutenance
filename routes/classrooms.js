const express = require("express");
const router = express.Router();
const db = require("../basedo");

// Endpoint pour récupérer la liste des classes
router.get("/", (req, res) => {
    db.all("SELECT * FROM classrooms", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint pour créer une nouvelle classe avec vérification d'unicité
router.post("/", (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(422).json({ error: 'Le paramètre "name" est requis.' });
    }

    db.get("SELECT * FROM classrooms WHERE name = ?", [name], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (row) {
            return res.status(409).json({ error: 'Une classe avec ce nom existe déjà.' });
        } else {
            db.run("INSERT INTO classrooms (name) VALUES (?)", [name], function (err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                } else {
                    res.status(201).json({ id: this.lastID, name });
                }
            });
        }
    });
});



// Endpoint pour modifier une classe avec vérification d'unicité
router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    // Vérification si le nom de la classe est présent
    if (!name) {
        return res.status(422).json({ error: 'Le paramètre "name" est requis.' });
    }

    // Vérification si une autre classe avec le même nom existe
    db.get("SELECT * FROM classrooms WHERE name = ? AND id != ?", [name, id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (row) {
            return res.status(409).json({ error: 'Une autre classe avec ce nom existe déjà.' });
        } else {
            // Mise à jour du nom de la classe
            db.run("UPDATE classrooms SET name = ? WHERE id = ?", [name, id], function (err) {
                if (err) {
                    return res.status(500).json({ error: err.message });
                } else {
                    res.status(200).json({ id, name });
                }
            });
        }
    });
});

module.exports = router;

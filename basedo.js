const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./soutenances.db', (err) => {
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
    } else {
        console.log('Connexion à la base de données SQLite réussie.');
    }
});


db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS classrooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            classroom_id INTEGER,
            FOREIGN KEY (classroom_id) REFERENCES classrooms (id)
        )
    `);
});


db.run("INSERT INTO classrooms (name) VALUES (?)", ['Classe A'], function (err) {
    if (err) {
        console.error('Erreur lors de l\'insertion dans classrooms:', err.message);
    } else {
        console.log('Classe insérée avec succès, ID:', this.lastID);
    }

  
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base de données:', err.message);
        } else {
            console.log('Base de données fermée.');
        }
    });
});

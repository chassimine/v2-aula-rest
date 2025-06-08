const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const PORT = process.env.PORT || 8080;

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS tshirts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      size TEXT,
      color TEXT
    )
  `);
});

app.use(express.json());
app.use(express.static('public'));

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/tshirt', (req, res) => {
  db.all("SELECT * FROM tshirts", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(rows);
  });
});

app.get('/tshirt/:id', (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM tshirts WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'T-shirt not found' });
    }
    res.status(200).json(row);
  });
});

app.post('/tshirt', (req, res) => {
  const { name, price, size, color } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  db.run(
    "INSERT INTO tshirts (name, price, size, color) VALUES (?, ?, ?, ?)",
    [name, price, size, color],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ 
        id: this.lastID,
        name,
        price,
        size,
        color
      });
    }
  );
});

app.delete('/tshirt/:id', (req, res) => {
  const id = req.params.id;
  
  db.run("DELETE FROM tshirts WHERE id = ?", [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'T-shirt not found' });
    }
    res.status(200).json({ message: 'T-shirt deleted successfully' });
  });
});
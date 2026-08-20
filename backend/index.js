import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
});

db.connect((error) => {
    if (error) {
        console.error("\n Error trying to connect to MySQL: ", error);
        return;
    }
    console.log("\nMySQL connection established successfully!\n");
});

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!");
});

app.get("/home", (req, res) => {
    res.json("Welcome to the home page!");
});

app.get("/clients", (req, res) => {
    db.query("SELECT * FROM clients", (error, data) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    });
});

app.post("/clients", (req, res) => {
    console.log("Body recebido:", req.body); // ← log do que chega
    const { name, phone, email, notes } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required." });
    const query = "INSERT INTO clients (name, phone, email, notes) VALUES (?, ?, ?, ?)";
    db.query(query, [name, phone, email, notes], (error, result) => {
        if (error) {
            console.error("Erro SQL:", error); // ← log do erro SQL
            return res.status(500).json({ error: error.message });
        }
        res.status(201).json({ message: "Client added!", id: result.insertId });
    });
});

app.put("/clients/:id", (req, res) => {
    const { name, phone, email, notes } = req.body;
    const query = "UPDATE clients SET name=?, phone=?, email=?, notes=? WHERE id=?";
    db.query(query, [name, phone, email, notes, req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Client not found." });
        res.json({ message: "Client updated!" });
    });
});

app.delete("/clients/:id", (req, res) => {
    db.query("DELETE FROM clients WHERE id=?", [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Client not found." });
        res.json({ message: "Client deleted!" });
    });
});

app.get("/procedures", (req, res) => {
    db.query("SELECT * FROM procedures", (error, data) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    });
});

app.post("/procedures", (req, res) => {
    const { name, description, default_duration, default_price } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required." });
    const query = "INSERT INTO procedures (name, description, default_duration, default_price) VALUES (?, ?, ?, ?)";
    db.query(query, [name, description, default_duration, default_price], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ message: "Procedure added!", id: result.insertId });
    });
});

app.put("/procedures/:id", (req, res) => {
    const { name, description, default_duration, default_price } = req.body;
    const query = "UPDATE procedures SET name=?, description=?, default_duration=?, default_price=? WHERE id=?";
    db.query(query, [name, description, default_duration, default_price, req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Procedure not found." });
        res.json({ message: "Procedure updated!" });
    });
});

app.delete("/procedures/:id", (req, res) => {
    db.query("DELETE FROM procedures WHERE id=?", [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Procedure not found." });
        res.json({ message: "Procedure deleted!" });
    });
});

app.get("/appointments", (req, res) => {
    db.query("SELECT * FROM appointments", (error, data) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(data);
    });
});

app.post("/appointments", (req, res) => {
    const { client_id, procedure_id, datetime, estimated_duration, charged_price, status, notes } = req.body;
    if (!client_id || !procedure_id || !datetime) {
        return res.status(400).json({ error: "Client ID, Procedure ID, and datetime are required." });
    }
    const query = `INSERT INTO appointments 
        (client_id, procedure_id, datetime, estimated_duration, charged_price, status, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(query, [client_id, procedure_id, datetime, estimated_duration, charged_price, status, notes], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ message: "Appointment added!", id: result.insertId });
    });
});

app.put("/appointments/:id", (req, res) => {
    const { client_id, procedure_id, datetime, estimated_duration, charged_price, status, notes } = req.body;
    const query = `UPDATE appointments SET 
        client_id=?, procedure_id=?, datetime=?, estimated_duration=?, charged_price=?, status=?, notes=? 
        WHERE id=?`;
    db.query(query, [client_id, procedure_id, datetime, estimated_duration, charged_price, status, notes, req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Appointment not found." });
        res.json({ message: "Appointment updated!" });
    });
});

app.delete("/appointments/:id", (req, res) => {
    db.query("DELETE FROM appointments WHERE id=?", [req.params.id], (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        if (result.affectedRows === 0) return res.status(404).json({ error: "Appointment not found." });
        res.json({ message: "Appointment deleted!" });
    });
});

app.listen(process.env.PORT || 5000, () => {
    console.log(`\nServer running on port ${process.env.PORT || 5000}`);
});

console.log("DB_DATABASE:", process.env.DB_DATABASE);
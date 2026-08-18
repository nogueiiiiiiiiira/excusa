// configure the backend server and database connection

import express from "express"
import mysql from "mysql2"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
})

db.connect((error) => {
    if (error) {
        console.error("\n Error trying to connect to MySQL: ", error)
        return
    }

    console.log("\nMySQL connection established successfully!\n")
})


// define the routes for the backend server

app.get("/", (req, res) => {
    res.json("Hello, this is the backend!")
})

app.get("/home", (req, res) => {
    res.json("Welcome to the home page!")
})  

app.get("/excuses", (req, res) => {
    const query = "SELECT * FROM excuses";
    db.query(query, (error, data) => {

        if (error) {
            console.error("Error fetching excuses: ", error);
            return res.json({ error: error.message })
        }

        return res.json(data)
    });
});

app.post("/excuses", (req, res) => {
    const query = "INSERT INTO excuses (`title`, `description`) VALUES (?)";

    const values = [
        req.body.title,
        req.body.description
    ];

    db.query(query, [values], (error, data) => {

        if (error) {
            return res.json({ error: error.message });
        }

        return res.json({ message: "Excuse added successfully!" });
    });
});

app.delete("/excuses/:id", (req, res) => {
    const excuseId = req.params.id;
    const query = "DELETE FROM excuses WHERE id = ?";

    db.query(query, [excuseId], (error, data) => {
        if (error) {
            return res.json({ error: error.message });
        }

        return res.json({ message: "Excuse deleted successfully!" });
    });
});

app.put("/excuses/:id", (req, res) => {
    const excuseId = req.params.id;
    const query = "UPDATE excuses SET `title` = ?, `description` = ? WHERE id = ?";
    const values = [
        req.body.title,
        req.body.description,
    ];

    db.query(query, [...values, excuseId], (error, data) => {
        if (error) {
            return res.json({ error: error.message });
        }

        return res.json({ message: "Excuse updated successfully!" });
    });
});



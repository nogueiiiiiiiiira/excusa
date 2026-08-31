import pool from "../config/database.js";
import { isBrazilianPhone, isValidEmail } from "../validation.js";

// validate client fields before database operations
const validateClient = (name, phone, email, res) => {
  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required.", field: "name" });

    return false;
  }

  if (!isBrazilianPhone(phone)) {
    res.status(400).json({
      error: "Phone must have at least 10 digits.",
      field: "phone",
    });

    return false;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Email must be valid.", field: "email" });

    return false;
  }

  return true;
};

// get all clients
export const listClients = async (req, res) => {
  const [clients] = await pool.query("SELECT * FROM clients");

  res.json(clients);
};

// create a new client with validation
export const createClient = async (req, res) => {
  const { name, phone, email, notes } = req.body;

  if (!validateClient(name, phone, email, res)) {
    return;
  }

  const [result] = await pool.query(
    "INSERT INTO clients (name, phone, email, notes) VALUES (?, ?, ?, ?)",
    [name.trim(), phone, email, notes],
  );

  res.status(201).json({ message: "Client added!", id: result.insertId });
};

// update an existing client by id
export const updateClient = async (req, res) => {
  const { name, phone, email, notes } = req.body;

  if (!validateClient(name, phone, email, res)) {
    return;
  }

  const [result] = await pool.query(
    "UPDATE clients SET name = ?, phone = ?, email = ?, notes = ? WHERE id = ?",
    [name.trim(), phone, email, notes, req.params.id],
  );

  if (result.affectedRows === 0) {
    console.warn(
      `Client update skipped: client ${req.params.id} was not found.`,
    );

    return res.status(404).json({ error: "Client not found." });
  }
  res.json({ message: "Client updated!" });
};

// delete a client by id
export const deleteClient = async (req, res) => {
  const [result] = await pool.query("DELETE FROM clients WHERE id = ?", [
    req.params.id,
  ]);

  if (result.affectedRows === 0) {
    console.warn(
      `Client deletion skipped: client ${req.params.id} was not found.`,
    );

    return res.status(404).json({ error: "Client not found." });
  }

  res.json({ message: "Client deleted!" });
};

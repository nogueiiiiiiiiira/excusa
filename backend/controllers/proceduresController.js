import pool from "../config/database.js";
import {
  hasValue,
  isNonNegativeNumber,
  isPositiveInteger,
} from "../validation.js";

const validateProcedure = (name, duration, price, res) => {
  if (typeof name !== "string" || !name.trim()) {
    res.status(400).json({ error: "Name is required.", field: "name" });

    return false;
  }

  if (!isPositiveInteger(duration) && hasValue(duration)) {
    res.status(400).json({
      error: "Duration must be a positive integer.",
      field: "default_duration",
    });

    return false;
  }

  if (!isNonNegativeNumber(price)) {
    res.status(400).json({
      error: "Price must be a non-negative number.",
      field: "default_price",
    });

    return false;
  }

  return true;
};

export const listProcedures = async (req, res) => {
  const [procedures] = await pool.query("SELECT * FROM procedures");

  res.json(procedures);
};

export const createProcedure = async (req, res) => {
  const { name, description, default_duration, default_price } = req.body;

  if (!validateProcedure(name, default_duration, default_price, res)) {
    return;
  }

  const [result] = await pool.query(
    "INSERT INTO procedures (name, description, default_duration, default_price) VALUES (?, ?, ?, ?)",
    [name.trim(), description, default_duration, default_price],
  );

  res.status(201).json({ message: "Procedure added!", id: result.insertId });
};

export const updateProcedure = async (req, res) => {
  const { name, description, default_duration, default_price } = req.body;

  if (!validateProcedure(name, default_duration, default_price, res)) {
    return;
  }

  const [result] = await pool.query(
    "UPDATE procedures SET name = ?, description = ?, default_duration = ?, default_price = ? WHERE id = ?",
    [name.trim(), description, default_duration, default_price, req.params.id],
  );

  if (result.affectedRows === 0) {
    console.warn(
      `Procedure update skipped: procedure ${req.params.id} was not found.`,
    );

    return res.status(404).json({ error: "Procedure not found." });
  }
  res.json({ message: "Procedure updated!" });
};

export const deleteProcedure = async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM procedures WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      console.warn(
        `Procedure deletion skipped: procedure ${req.params.id} was not found.`,
      );

      return res.status(404).json({ error: "Procedure not found." });
    }

    res.json({ message: "Procedure deleted!" });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      console.warn(
        `Procedure deletion blocked: procedure ${req.params.id} is used by an appointment.`,
      );

      return res.status(409).json({
        error:
          "This procedure cannot be deleted because it is used by existing appointments.",
      });
    }

    throw error;
  }
};

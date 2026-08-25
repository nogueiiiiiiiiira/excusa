import pool from "../config/database.js";

export const listGeneralHistory = async (req, res) => {
  const [history] = await pool.query(`
    SELECT id, action, client_name, procedure_name, appointment_datetime,
      estimated_duration, charged_price, appointment_status, payment_status,
      notes, recorded_at
    FROM general_history
    ORDER BY recorded_at DESC, id DESC
  `);

  res.json(history);
};

export const listSystemHistory = async (req, res) => {
  const [history] = await pool.query(`
    SELECT id, entity_type, action, entity_name, details, recorded_at
    FROM system_history
    ORDER BY recorded_at DESC, id DESC
  `);

  res.json(history);
};

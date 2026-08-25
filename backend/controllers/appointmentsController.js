import pool from "../config/database.js";
import {
  appointmentStatuses,
  hasValue,
  isNonNegativeNumber,
  isPositiveInteger,
  paymentStatuses,
} from "../validation.js";

const validateAppointment = (data, res) => {
  const {
    client_id,
    procedure_id,
    datetime,
    estimated_duration,
    charged_price,
    status,
    payment_status,
  } = data;

  if (
    !isPositiveInteger(client_id) ||
    !isPositiveInteger(procedure_id) ||
    !datetime
  ) {
    res.status(400).json({
      error: "Client ID, Procedure ID, and datetime are required.",
      fields: ["client_id", "procedure_id", "datetime"],
    });

    return false;
  }

  if (!appointmentStatuses.has(status)) {
    res.status(400).json({
      error: "Invalid appointment status.",
      field: "status",
    });

    return false;
  }

  if (!paymentStatuses.has(payment_status)) {
    res.status(400).json({
      error: "Invalid payment status.",
      field: "payment_status",
    });

    return false;
  }

  if (!isPositiveInteger(estimated_duration) && hasValue(estimated_duration)) {
    res.status(400).json({
      error: "Duration must be a positive integer.",
      field: "estimated_duration",
    });

    return false;
  }

  if (!isNonNegativeNumber(charged_price)) {
    res.status(400).json({
      error: "Price must be a non-negative number.",
      field: "charged_price",
    });

    return false;
  }

  return true;
};

export const listAppointments = async (req, res) => {
  const query = `SELECT appointments.*, clients.name AS client_name,
    procedures.name AS procedure_name
    FROM appointments
    JOIN clients ON clients.id = appointments.client_id
    JOIN procedures ON procedures.id = appointments.procedure_id`;

  const [appointments] = await pool.query(query);

  res.json(appointments);
};

export const createAppointment = async (req, res) => {
  if (!validateAppointment(req.body, res)) {
    return;
  }

  const {
    client_id,
    procedure_id,
    datetime,
    estimated_duration,
    charged_price,
    status,
    payment_status,
    notes,
  } = req.body;

  const query = `INSERT INTO appointments
    (client_id, procedure_id, datetime, estimated_duration, charged_price, status, payment_status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await pool.query(query, [
    client_id,
    procedure_id,
    datetime,
    estimated_duration,
    charged_price,
    status,
    payment_status,
    notes,
  ]);

  res.status(201).json({ message: "Appointment added!", id: result.insertId });
};

export const updateAppointment = async (req, res) => {
  if (!validateAppointment(req.body, res)) {
    return;
  }

  const {
    client_id,
    procedure_id,
    datetime,
    estimated_duration,
    charged_price,
    status,
    payment_status,
    notes,
  } = req.body;

  const query = `UPDATE appointments SET
    client_id = ?, procedure_id = ?, datetime = ?, estimated_duration = ?, charged_price = ?, status = ?, payment_status = ?, notes = ?
    WHERE id = ?`;

  const [result] = await pool.query(query, [
    client_id,
    procedure_id,
    datetime,
    estimated_duration,
    charged_price,
    status,
    payment_status,
    notes,
    req.params.id,
  ]);

  if (result.affectedRows === 0) {
    console.warn(
      `Appointment update skipped: appointment ${req.params.id} was not found.`,
    );

    return res.status(404).json({ error: "Appointment not found." });
  }

  res.json({ message: "Appointment updated!" });
};

export const deleteAppointment = async (req, res) => {
  const [result] = await pool.query("DELETE FROM appointments WHERE id = ?", [
    req.params.id,
  ]);

  if (result.affectedRows === 0) {
    console.warn(
      `Appointment deletion skipped: appointment ${req.params.id} was not found.`,
    );

    return res.status(404).json({ error: "Appointment not found." });
  }

  res.json({ message: "Appointment deleted!" });
};

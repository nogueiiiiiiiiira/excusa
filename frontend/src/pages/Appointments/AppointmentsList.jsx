import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
  appointmentStatuses,
  formatCurrency,
  formatDateTime,
} from "../../formUtils";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const res = await api.get("/appointments");
        setAppointments(res.data);
      } catch (requestError) {
        console.error("Failed to load appointments:", requestError.message);
        setError("Unable to load appointments.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      await api.delete(`/appointments/${id}`);
      setAppointments((current) =>
        current.filter((appointment) => appointment.id !== id),
      );
      setMessage("Appointment deleted successfully.");
    } catch (requestError) {
      console.error(
        `Failed to delete appointment ${id}:`,
        requestError.message,
      );
      setError("Unable to delete the appointment.");
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      `${appointment.client_name} ${appointment.procedure_name}`
        .toLowerCase()
        .includes(search.toLowerCase());

    return (
      matchesSearch && (!statusFilter || appointment.status === statusFilter)
    );
  });

  return (
    <div>
      <h1>List of Appointments</h1>
      {loading && <p>Loading appointments...</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <input
        type="search"
        placeholder="Ex: Karen or Haircut"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        aria-label="Filter by status"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="">All statuses</option>
        {appointmentStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <div className="appointments">
        {!loading && !error && filteredAppointments.length === 0 && (
          <p className="empty-state">No appointments found.</p>
        )}
        {filteredAppointments.map((appointment) => (
          <div key={appointment.id} className="appointment">
            <h2>Client: {appointment.client_name}</h2>
            <p>Procedure: {appointment.procedure_name}</p>
            <p>Date and Time: {formatDateTime(appointment.datetime)}</p>
            <p>Estimated Duration: {appointment.estimated_duration} min</p>
            <p>Charged Price: {formatCurrency(appointment.charged_price)}</p>
            <p>Status: {appointment.status}</p>
            <p>Payment: {appointment.payment_status}</p>
            <p>Notes: {appointment.notes}</p>
            <button
              className="delete"
              type="button"
              onClick={() => handleDelete(appointment.id)}
            >
              Delete
            </button>
            <button className="update">
              <Link
                to={`/appointments/update/${appointment.id}`}
                style={{ color: "inherit", textDecoration: "none" }}
              >
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>
      <button className="addHome" type="button">
        <Link
          to="/appointments/add"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Add Appointment
        </Link>
      </button>
    </div>
  );
};

export default AppointmentsList;

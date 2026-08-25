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
  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
      <div className="page-heading">
        <h1>List of Appointments</h1>
        <Link className="addHome" to="/appointments/add">Add Appointment</Link>
      </div>
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
            <h2>{appointment.client_name}</h2>
            <p><strong>Procedure:</strong> {appointment.procedure_name}</p>
            <p><strong>Date and Time:</strong> {formatDateTime(appointment.datetime)}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
            <div className="card-actions">
              <button className="details-button" type="button" onClick={() => setSelectedAppointment(appointment)}>Details</button>
              <button className="delete" type="button" onClick={() => handleDelete(appointment.id)}>Delete</button>
              <Link className="update" to={`/appointments/update/${appointment.id}`}>Update</Link>
            </div>
          </div>
        ))}
      </div>
      {selectedAppointment && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedAppointment(null)}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="appointment-details-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelectedAppointment(null)}>×</button>
            <h2 id="appointment-details-title">{selectedAppointment.client_name}</h2>
            <p><strong>Procedure:</strong> {selectedAppointment.procedure_name}</p>
            <p><strong>Date and Time:</strong> {formatDateTime(selectedAppointment.datetime)}</p>
            <p><strong>Estimated Duration:</strong> {selectedAppointment.estimated_duration} min</p>
            <p><strong>Charged Price:</strong> {formatCurrency(selectedAppointment.charged_price)}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            <p><strong>Payment:</strong> {selectedAppointment.payment_status}</p>
            <p><strong>Notes:</strong> {selectedAppointment.notes || "Not informed"}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

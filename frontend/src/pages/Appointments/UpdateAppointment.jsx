import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import {
  appointmentStatuses,
  paymentStatuses,
  toDateTimeLocal,
  toNumberOrNull,
} from "../../formUtils";

const UpdateAppointment = () => {
  const [appointment, setAppointment] = useState({
    client_id: "",
    procedure_id: "",
    datetime: "",
    estimated_duration: "",
    charged_price: "",
    status: "",
    payment_status: "pending",
    notes: "",
  });
  const [error, setError] = useState("");
  const [clients, setClients] = useState([]);
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id: appointmentId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointmentResponse, clientsResponse, proceduresResponse] =
          await Promise.all([
            api.get("/appointments"),
            api.get("/clients"),
            api.get("/procedures"),
          ]);
        const existingAppointment = appointmentResponse.data.find(
          (item) => String(item.id) === appointmentId,
        );

        if (!existingAppointment) {
          throw new Error("Appointment not found");
        }
        setAppointment({
          ...existingAppointment,
          datetime: toDateTimeLocal(existingAppointment.datetime),
        });
        setClients(clientsResponse.data);
        setProcedures(proceduresResponse.data);
      } catch (requestError) {
        console.error(
          `Failed to load appointment ${appointmentId}:`,
          requestError.message,
        );
        setError("Unable to load the appointment.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [appointmentId]);

  const handleChange = (event) => {
    setAppointment((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // create new with form validation
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!window.confirm("Do you want to update this appointment?")) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.put(`/appointments/${appointmentId}`, {
        ...appointment,
        client_id: toNumberOrNull(appointment.client_id),
        procedure_id: toNumberOrNull(appointment.procedure_id),
        estimated_duration: toNumberOrNull(appointment.estimated_duration),
        charged_price: toNumberOrNull(appointment.charged_price),
      });
      window.alert("Appointment updated successfully.");
      navigate("/appointments");
    } catch (requestError) {
      console.error(
        `Failed to update appointment ${appointmentId}:`,
        requestError.message,
      );
      setError(
        requestError.response?.data?.error ||
          "Unable to update the appointment.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Update the Appointment</h1>
      {loading && <p>Loading appointment...</p>}
      <label htmlFor="client_id">Client</label>
      <select
        name="client_id"
        value={appointment.client_id}
        onChange={handleChange}
        required
      >
        <option value="">Select a client</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name}
          </option>
        ))}
      </select>
      <label htmlFor="procedure_id">Procedure</label>
      <select
        name="procedure_id"
        value={appointment.procedure_id}
        onChange={handleChange}
        required
      >
        <option value="">Select a procedure</option>
        {procedures.map((procedure) => (
          <option key={procedure.id} value={procedure.id}>
            {procedure.name}
          </option>
        ))}
      </select>
      <label htmlFor="datetime">Date and time</label>
      <input
        type="datetime-local"
        name="datetime"
        value={appointment.datetime}
        onChange={handleChange}
        required
      />
      <label htmlFor="estimated_duration">Estimated duration</label>
      <input
        type="number"
        min="1"
        placeholder="Ex: 45 minutes"
        name="estimated_duration"
        value={appointment.estimated_duration ?? ""}
        onChange={handleChange}
      />
      <label htmlFor="charged_price">Charged price</label>
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Ex: 70.00"
        name="charged_price"
        value={appointment.charged_price ?? ""}
        onChange={handleChange}
      />
      <label htmlFor="status">Status</label>
      <select
        name="status"
        value={appointment.status}
        onChange={handleChange}
        required
      >
        {appointmentStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <label htmlFor="payment_status">Payment status</label>
      <select
        name="payment_status"
        value={appointment.payment_status}
        onChange={handleChange}
        required
      >
        {paymentStatuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
      <label htmlFor="notes">Notes</label>
      <textarea
        placeholder="Ex: Client requested a quiet appointment"
        name="notes"
        value={appointment.notes ?? ""}
        onChange={handleChange}
      />
      <button className="update-submit" type="submit" disabled={loading || saving}>
        {saving ? "Saving..." : "Update Appointment"}
      </button>
      {error && <span className="form-error" role="alert">{error}</span>}
    </form>
  );
};

export default UpdateAppointment;

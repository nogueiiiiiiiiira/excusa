import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import {
  brazilianPhonePattern,
  formatBrazilianPhone,
} from "../../formUtils";

const AddClients = () => {
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    const value =
      event.target.name === "phone"
        ? formatBrazilianPhone(event.target.value)
        : event.target.value;

    setClient((prev) => ({ ...prev, [event.target.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!window.confirm("Do you want to add this client?")) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.post("/clients", client);
      window.alert("Client added successfully.");
      navigate("/clients");
    } catch (requestError) {
      console.error("Failed to add client:", requestError.message);
      setError(
        requestError.response?.data?.error ||
          (requestError.request
            ? "Unable to reach the server. Make sure the backend is running."
            : "Unable to add the client."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Add New Client</h1>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        placeholder="Ex: Karen Cristini Nogueira"
        name="name"
        value={client.name}
        onChange={handleChange}
        required
      />
      <label htmlFor="phone">Phone</label>
      <input
        type="tel"
        placeholder="Ex: (31) 9 9999-9999"
        name="phone"
        value={client.phone}
        onChange={handleChange}
        pattern={brazilianPhonePattern}
        title="Enter a valid Brazilian phone number, such as (41) 99999-9999."
        maxLength="16"
        inputMode="numeric"
        autoComplete="tel"
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="Ex: karen.nogueira@example.com"
        name="email"
        value={client.email}
        onChange={handleChange}
      />
      <label htmlFor="notes">Notes</label>
      <textarea
        placeholder="Ex: Prefers morning appointments"
        name="notes"
        value={client.notes}
        onChange={handleChange}
      />
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add New Client"}
      </button>
      {error && <span className="form-error" role="alert">{error}</span>}
    </form>
  );
};

export default AddClients;

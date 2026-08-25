import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import {
  brazilianPhonePattern,
  formatBrazilianPhone,
} from "../../formUtils";

const UpdateClient = () => {
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id: clientId } = useParams();

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await api.get("/clients");
        const existingClient = res.data.find(
          (item) => String(item.id) === clientId,
        );

        if (!existingClient) {
          throw new Error("Client not found");
        }
        setClient({
          ...existingClient,
          phone: formatBrazilianPhone(existingClient.phone || ""),
        });
      } catch (requestError) {
        console.error(
          `Failed to load client ${clientId}:`,
          requestError.message,
        );
        setError("Unable to load the client.");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [clientId]);

  const handleChange = (event) => {
    const value =
      event.target.name === "phone"
        ? formatBrazilianPhone(event.target.value)
        : event.target.value;

    setClient((prev) => ({ ...prev, [event.target.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!window.confirm("Do you want to update this client?")) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.put(`/clients/${clientId}`, client);
      window.alert("Client updated successfully.");
      navigate("/clients");
    } catch (requestError) {
      console.error(
        `Failed to update client ${clientId}:`,
        requestError.message,
      );
      setError(
        requestError.response?.data?.error || "Unable to update the client.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Update the Client</h1>
      {loading && <p>Loading client...</p>}
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
      <button type="submit" disabled={loading || saving}>
        {saving ? "Saving..." : "Update"}
      </button>
      {error && <span role="alert">{error}</span>}
      <Link to="/clients">See all clients</Link>
    </form>
  );
};

export default UpdateClient;

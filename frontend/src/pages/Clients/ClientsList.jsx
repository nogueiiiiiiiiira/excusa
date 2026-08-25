import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const res = await api.get("/clients");
        setClients(res.data);
      } catch (requestError) {
        console.error("Failed to load clients:", requestError.message);
        setError("Unable to load clients.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllClients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }

    try {
      await api.delete(`/clients/${id}`);
      setClients((current) => current.filter((client) => client.id !== id));
      setMessage("Client deleted successfully.");
    } catch (requestError) {
      console.error(`Failed to delete client ${id}:`, requestError.message);
      setError("Unable to delete the client.");
    }
  };

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <h1>List of Clients</h1>
      {loading && <p>Loading clients...</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <input
        type="search"
        placeholder="Ex: Karen"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="clients">
        {!loading && !error && filteredClients.length === 0 && (
          <p className="empty-state">No clients found.</p>
        )}
        {filteredClients.map((client) => (
          <div key={client.id} className="client">
            <h2>{client.name}</h2>
            <p>{client.phone}</p>
            <p>{client.email}</p>
            <p>{client.notes}</p>
            <button
              className="delete"
              type="button"
              onClick={() => handleDelete(client.id)}
            >
              Delete
            </button>
            <button className="update">
              <Link
                to={`/clients/update/${client.id}`}
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
          to="/clients/add"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Add New Client
        </Link>
      </button>
    </div>
  );
};

export default ClientsList;

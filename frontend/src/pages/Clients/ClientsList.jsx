import { useEffect, useState } from "react";
import api from "../../api";
import { Link } from "react-router-dom";

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [selectedClient, setSelectedClient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const res = await api.get("/clients");
        const sortedData = [...res.data].sort((a, b) => b.id - a.id);
        setClients(sortedData);
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
  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleClients = filteredClients.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  return (
    <div>
      <div className="page-heading">
        <h1>List of Clients</h1>
        <Link className="addHome" to="/clients/add">Add New Client</Link>
      </div>
      {loading && <p>Loading clients...</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <input
        type="search"
        placeholder="Search client..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setCurrentPage(1);
        }}
      />
      <div className="clients">
        {!loading && !error && filteredClients.length === 0 && (
          <p className="empty-state">No clients found.</p>
        )}
        {visibleClients.map((client) => (
          <div key={client.id} className="client">
            <h2><strong>Name:</strong> {client.name}</h2>
            <p><strong>Phone:</strong> {client.phone || "Not informed"}</p>
            <p><strong>Email:</strong> {client.email || "Not informed"}</p>
            <p className="card-summary"><strong>Notes:</strong> {client.notes || "Not informed"}</p>
            <div className="card-actions">
              <button className="details-button" type="button" onClick={() => setSelectedClient(client)}>Details</button>
              <button className="delete" type="button" onClick={() => handleDelete(client.id)}>Delete</button>
              <Link className="update" to={`/clients/update/${client.id}`}>Update</Link>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Clients pages">
          <button type="button" disabled={visiblePage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
            Previous
          </button>
          <span>Page {visiblePage} of {totalPages}</span>
          <button type="button" disabled={visiblePage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
            Next
          </button>
        </nav>
      )}
      {selectedClient && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedClient(null)}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="client-details-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelectedClient(null)}>×</button>
            <h2 id="client-details-title">{selectedClient.name}</h2>
            <p><strong>Phone:</strong> {selectedClient.phone || "Not informed"}</p>
            <p><strong>Email:</strong> {selectedClient.email || "Not informed"}</p>
            <p><strong>Notes:</strong> {selectedClient.notes || "Not informed"}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default ClientsList;
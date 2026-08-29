import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { formatCurrency } from "../../formUtils";

const ProceduresList = () => {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchAllProcedures = async () => {
      try {
        const res = await api.get("/procedures");
        const sortedData = [...res.data].sort((a, b) => b.id - a.id);
        setProcedures(sortedData);
      } catch (requestError) {
        console.error("Failed to load procedures:", requestError.message);
        setError("Unable to load procedures.");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProcedures();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this procedure?")) {
      return;
    }

    try {
      await api.delete(`/procedures/${id}`);
      setProcedures((current) =>
        current.filter((procedure) => procedure.id !== id),
      );
      setMessage("Procedure deleted successfully.");
    } catch (requestError) {
      console.error(`Failed to delete procedure ${id}:`, requestError.message);
      setError(
        requestError.response?.data?.error ||
          "Unable to delete the procedure.",
      );
    }
  };

  const filteredProcedures = procedures.filter((procedure) =>
    procedure.name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredProcedures.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleProcedures = filteredProcedures.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  return (
    <div>
      <div className="page-heading">
        <h1>List of Procedures</h1>
        <Link className="addHome" to="/procedures/add">Add New Procedure</Link>
      </div>
      {loading && <p>Loading procedures...</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <input
        type="search"
        placeholder="Search procedure..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setCurrentPage(1);
        }}
      />
      <div className="procedures">
        {!loading && !error && filteredProcedures.length === 0 && (
          <p className="empty-state">No procedures found.</p>
        )}
        {visibleProcedures.map((procedure) => (
          <div key={procedure.id} className="procedure">
            <h2><strong>Name:</strong> {procedure.name}</h2>
            <p className="card-summary"><strong>Description:</strong> {procedure.description || "Not informed"}</p>
            <p><strong>Duration:</strong> {procedure.default_duration} min</p>
            <p><strong>Price:</strong> {formatCurrency(procedure.default_price)}</p>
            <div className="card-actions">
              <button className="details-button" type="button" onClick={() => setSelectedProcedure(procedure)}>Details</button>
              <button className="delete" type="button" onClick={() => handleDelete(procedure.id)}>Delete</button>
              <Link className="update" to={`/procedures/update/${procedure.id}`}>Update</Link>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="Procedures pages">
          <button type="button" disabled={visiblePage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
            Previous
          </button>
          <span>Page {visiblePage} of {totalPages}</span>
          <button type="button" disabled={visiblePage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
            Next
          </button>
        </nav>
      )}
      {selectedProcedure && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedProcedure(null)}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="procedure-details-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelectedProcedure(null)}>×</button>
            <h2 id="procedure-details-title">{selectedProcedure.name}</h2>
            <p><strong>Description:</strong> {selectedProcedure.description || "Not informed"}</p>
            <p><strong>Duration:</strong> {selectedProcedure.default_duration} min</p>
            <p><strong>Price:</strong> {formatCurrency(selectedProcedure.default_price)}</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default ProceduresList;
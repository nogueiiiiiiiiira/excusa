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

  useEffect(() => {
    const fetchAllProcedures = async () => {
      try {
        const res = await api.get("/procedures");
        setProcedures(res.data);
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

  return (
    <div>
      <h1>List of Procedures</h1>
      {loading && <p>Loading procedures...</p>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <input
        type="search"
        placeholder="Ex: Haircut"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="procedures">
        {!loading && !error && filteredProcedures.length === 0 && (
          <p className="empty-state">No procedures found.</p>
        )}
        {filteredProcedures.map((procedure) => (
          <div key={procedure.id} className="procedure">
            <h2>{procedure.name}</h2>
            <p>{procedure.description}</p>
            <p>Duration: {procedure.default_duration} min</p>
            <p>Price: {formatCurrency(procedure.default_price)}</p>
            <button
              className="delete"
              type="button"
              onClick={() => handleDelete(procedure.id)}
            >
              Delete
            </button>
            <button className="update">
              <Link
                to={`/procedures/update/${procedure.id}`}
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
          to="/procedures/add"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Add New Procedure
        </Link>
      </button>
    </div>
  );
};

export default ProceduresList;

import { useEffect, useState } from "react";
import api from "../../api";
import { formatDateTime } from "../../formUtils";

const SystemHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history/system");
        // Ordenar por ID decrescente (mais recente primeiro)
        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        setHistory(sortedData);
      } catch (requestError) {
        console.error("Failed to load system history:", requestError.message);
        setError("Unable to load system history.");
      }
    };

    fetchHistory();
  }, []);

  const filteredHistory = history.filter((entry) =>
    JSON.stringify(entry).toLowerCase().includes(search.toLowerCase()),
  );
  
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const visiblePage = Math.min(currentPage, totalPages);
  const visibleHistory = filteredHistory.slice(
    (visiblePage - 1) * pageSize,
    visiblePage * pageSize,
  );

  return (
    <section>
      <h1>System History</h1>
      {error && <p role="alert">{error}</p>}
      <input
        className="history-search"
        type="search"
        placeholder="Search system history..."
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setCurrentPage(1);
        }}
      />
      {!error && filteredHistory.length === 0 && <p className="empty-state">No system history found.</p>}
      <div className="history-list">
        {visibleHistory.map((entry) => (
          <article className="history-entry" key={entry.id}>
            <h2><strong>Name:</strong> {entry.entity_name}</h2>
            <p><strong>Entity:</strong> {entry.entity_type}</p>
            <p><strong>Action:</strong> {entry.action}</p>
            <p><strong>Recorded:</strong> {formatDateTime(entry.recorded_at)}</p>
            <button className="details-button history-details" type="button" onClick={() => setSelectedEntry(entry)}>Details</button>
          </article>
        ))}
      </div>
      {totalPages > 1 && (
        <nav className="pagination" aria-label="System History pages">
          <button type="button" disabled={visiblePage === 1} onClick={() => setCurrentPage((page) => page - 1)}>
            Previous
          </button>
          <span>Page {visiblePage} of {totalPages}</span>
          <button type="button" disabled={visiblePage === totalPages} onClick={() => setCurrentPage((page) => page + 1)}>
            Next
          </button>
        </nav>
      )}
      {selectedEntry && (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedEntry(null)}>
          <section className="details-modal" role="dialog" aria-modal="true" aria-labelledby="system-history-details-title" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close details" onClick={() => setSelectedEntry(null)}>×</button>
            <h2 id="system-history-details-title">System History Details</h2>
            <p><strong>Name:</strong> {selectedEntry.entity_name}</p>
            <p><strong>Entity:</strong> {selectedEntry.entity_type}</p>
            <p><strong>Action:</strong> {selectedEntry.action}</p>
            <p><strong>Details:</strong> {selectedEntry.details}</p>
            <p><strong>Recorded:</strong> {formatDateTime(selectedEntry.recorded_at)}</p>
          </section>
        </div>
      )}
    </section>
  );
};

export default SystemHistoryPage;
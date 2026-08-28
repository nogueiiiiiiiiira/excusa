import { useEffect, useState } from "react";
import api from "../api";
import { formatDateTime } from "../formUtils";

const SystemHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history/system");
        setHistory(response.data);
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

  return (
    <section>
      <h1>System History</h1>
      {error && <p role="alert">{error}</p>}
      <input
        className="history-search"
        type="search"
        placeholder="Search system history"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      {!error && filteredHistory.length === 0 && <p className="empty-state">No system history found.</p>}
      <div className="history-list">
        {filteredHistory.map((entry) => (
          <article className="history-entry" key={entry.id}>
            <h2><strong>Name:</strong> {entry.entity_name}</h2>
            <p><strong>Entity:</strong> {entry.entity_type}</p>
            <p><strong>Action:</strong> {entry.action}</p>
            <p><strong>Details:</strong> {entry.details}</p>
            <br></br>
            <small><strong>Recorded:</strong> {formatDateTime(entry.recorded_at)}</small>
            <button className="details-button history-details" type="button" onClick={() => setSelectedEntry(entry)}>Details</button>
          </article>
        ))}
      </div>
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

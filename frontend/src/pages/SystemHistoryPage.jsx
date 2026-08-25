import { useEffect, useState } from "react";
import api from "../api";
import { formatDateTime } from "../formUtils";

const SystemHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

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

  return (
    <section>
      <h1>System History</h1>
      {error && <p role="alert">{error}</p>}
      {history.length === 0 && !error && <p className="empty-state">No system history found.</p>}
      <div className="history-list">
        {history.map((entry) => (
          <article className="history-entry" key={entry.id}>
            <h2>{entry.entity_name}</h2>
            <p>Entity: {entry.entity_type}</p>
            <p>Action: {entry.action}</p>
            <p>{entry.details}</p>
            <small>Recorded: {formatDateTime(entry.recorded_at)}</small>
          </article>
        ))}
      </div>
    </section>
  );
};

export default SystemHistoryPage;

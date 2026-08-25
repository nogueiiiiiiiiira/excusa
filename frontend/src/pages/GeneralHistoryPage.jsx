import { useEffect, useState } from "react";
import api from "../api";
import { formatCurrency, formatDateTime } from "../formUtils";

const GeneralHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get("/history/general");
        setHistory(response.data);
      } catch (requestError) {
        console.error("Failed to load general history:", requestError.message);
        setError("Unable to load general history.");
      }
    };

    fetchHistory();
  }, []);

  return (
    <section>
      <h1>General History</h1>
      {error && <p role="alert">{error}</p>}
      {history.length === 0 && !error && <p className="empty-state">No history found.</p>}
      <div className="history-list">
        {history.map((entry) => (
          <article className="history-entry" key={entry.id}>
            <h2>{entry.procedure_name || "Procedure unavailable"}</h2>
            <p>Action: {entry.action}</p>
            <p>Client: {entry.client_name || "Client unavailable"}</p>
            <p>Date and Time: {formatDateTime(entry.appointment_datetime)}</p>
            <p>Charged Price: {formatCurrency(entry.charged_price)}</p>
            <p>Appointment Status: {entry.appointment_status || "-"}</p>
            <p>Payment Status: {entry.payment_status || "-"}</p>
            <p>Notes: {entry.notes || "-"}</p>
            <small>Recorded: {formatDateTime(entry.recorded_at)}</small>
          </article>
        ))}
      </div>
    </section>
  );
};

export default GeneralHistoryPage;

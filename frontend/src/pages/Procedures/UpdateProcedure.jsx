import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import { toNumberOrNull } from "../../formUtils";

const UpdateProcedure = () => {
  const [procedure, setProcedure] = useState({
    name: "",
    description: "",
    default_duration: "",
    default_price: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id: procedureId } = useParams();

  useEffect(() => {
    const fetchProcedure = async () => {
      try {
        const res = await api.get("/procedures");
        const existingProcedure = res.data.find(
          (item) => String(item.id) === procedureId,
        );

        if (!existingProcedure) {
          throw new Error("Procedure not found");
        }
        setProcedure(existingProcedure);
      } catch (requestError) {
        console.error(
          `Failed to load procedure ${procedureId}:`,
          requestError.message,
        );
        setError("Unable to load the procedure.");
      } finally {
        setLoading(false);
      }
    };
    fetchProcedure();
  }, [procedureId]);

  const handleChange = (event) => {
    setProcedure((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!window.confirm("Do you want to update this procedure?")) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.put(`/procedures/${procedureId}`, {
        ...procedure,
        default_duration: toNumberOrNull(procedure.default_duration),
        default_price: toNumberOrNull(procedure.default_price),
      });
      window.alert("Procedure updated successfully.");
      navigate("/procedures");
    } catch (requestError) {
      console.error(
        `Failed to update procedure ${procedureId}:`,
        requestError.message,
      );
      setError(
        requestError.response?.data?.error || "Unable to update the procedure.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Update the Procedure</h1>
      {loading && <p>Loading procedure...</p>}
      <label htmlFor="name">Name</label>
      <input
        type="text"
        placeholder="Ex: Haircut"
        name="name"
        value={procedure.name}
        onChange={handleChange}
      />
      <label htmlFor="description">Description</label>
      <textarea
        placeholder="Ex: A simple haircut"
        name="description"
        value={procedure.description}
        onChange={handleChange}
      />
      <label htmlFor="default_duration">Default duration</label>
      <input
        type="number"
        min="1"
        placeholder="Ex: 30 minutes"
        name="default_duration"
        value={procedure.default_duration}
        onChange={handleChange}
      />
      <label htmlFor="default_price">Default price</label>
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Ex: 50.00"
        name="default_price"
        value={procedure.default_price}
        onChange={handleChange}
      />
      <button type="submit" disabled={loading || saving}>
        {saving ? "Saving..." : "Update"}
      </button>
      {error && <span role="alert">{error}</span>}
    </form>
  );
};

export default UpdateProcedure;

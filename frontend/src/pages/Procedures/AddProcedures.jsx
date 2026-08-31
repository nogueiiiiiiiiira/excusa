import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { toNumberOrNull } from "../../formUtils";

const AddProcedures = () => {
  const [procedure, setProcedure] = useState({
    name: "",
    description: "",
    default_duration: "",
    default_price: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setProcedure((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  // create new with form validation
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!window.confirm("Do you want to add this procedure?")) {
      return;
    }

    setError("");
    setSaving(true);

    try {
      await api.post("/procedures", {
        ...procedure,
        default_duration: toNumberOrNull(procedure.default_duration),
        default_price: toNumberOrNull(procedure.default_price),
      });
      window.alert("Procedure added successfully.");
      navigate("/procedures");
    } catch (requestError) {
      console.error("Failed to add procedure:", requestError.message);
      setError(
        requestError.response?.data?.error ||
          (requestError.request
            ? "Unable to reach the server. Make sure the backend is running."
            : "Unable to add the procedure."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h1>Add New Procedure</h1>
      <label htmlFor="name">Name</label>
      <input
        type="text"
        placeholder="Ex: Haircut"
        name="name"
        value={procedure.name}
        onChange={handleChange}
        required
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
      <button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Add New Procedure"}
      </button>
      {error && <span className="form-error" role="alert">{error}</span>}
    </form>
  );
};

export default AddProcedures;

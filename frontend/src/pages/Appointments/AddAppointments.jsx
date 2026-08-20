import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddAppointments = () => {
  const [appointment, setAppointment] = useState({
    client_id: "",
    procedure_id: "",
    datetime: "",
    estimated_duration: "",
    charged_price: "",
    status: "scheduled",
    notes: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setAppointment((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/appointments", appointment);
      navigate("/appointments");
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add New Appointment</h1>
      <input type="number" placeholder="Client ID" name="client_id" onChange={handleChange} />
      <input type="number" placeholder="Procedure ID" name="procedure_id" onChange={handleChange} />
      <input type="datetime-local" name="datetime" onChange={handleChange} />
      <input type="number" placeholder="Duration (minutes)" name="estimated_duration" onChange={handleChange} />
      <input type="number" step="0.01" placeholder="Price" name="charged_price" onChange={handleChange} />
      <input type="text" placeholder="Status (scheduled, confirmed, done, canceled, missed, late)" name="status" onChange={handleChange} />
      <input type="text" placeholder="Notes" name="notes" onChange={handleChange} />
      <button onClick={handleClick}>Add Appointment</button>
      {error && <span>Something went wrong!</span>}
    </div>
  );
};

export default AddAppointments;
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateAppointment = () => {
  const [appointment, setAppointment] = useState({
    client_id: "",
    procedure_id: "",
    datetime: "",
    estimated_duration: "",
    charged_price: "",
    status: "",
    notes: "",
  });
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const appointmentId = location.pathname.split("/")[3];

  const handleChange = (event) => {
    setAppointment((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/appointments/${appointmentId}`, appointment);
      navigate("/appointments");
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Update the Appointment</h1>
      <input type="number" placeholder="Client ID" name="client_id" onChange={handleChange} />
      <input type="number" placeholder="Procedure ID" name="procedure_id" onChange={handleChange} />
      <input type="datetime-local" name="datetime" onChange={handleChange} />
      <input type="number" placeholder="Duration (minutes)" name="estimated_duration" onChange={handleChange} />
      <input type="number" step="0.01" placeholder="Price" name="charged_price" onChange={handleChange} />
      <input type="text" placeholder="Status" name="status" onChange={handleChange} />
      <input type="text" placeholder="Notes" name="notes" onChange={handleChange} />
      <button onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
    </div>
  );
};

export default UpdateAppointment;
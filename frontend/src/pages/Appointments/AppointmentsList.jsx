import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAllAppointments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/appointments");
        setAppointments(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllAppointments();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/appointments/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>List of Appointments</h1>
      <div className="appointments">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="appointment">
            <h2>Client ID: {appointment.client_id}</h2>
            <p>Procedure ID: {appointment.procedure_id}</p>
            <p>Date and Time: {appointment.datetime}</p>
            <p>Estimated Duration: {appointment.estimated_duration} min</p>
            <p>Charged Price: ${appointment.charged_price}</p>
            <p>Status: {appointment.status}</p>
            <p>Notes: {appointment.notes}</p>
            <button className="delete" onClick={() => handleDelete(appointment.id)}>Delete</button>
            <button className="update">
              <Link to={`/appointments/update/${appointment.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>
      <button className="addHome">
        <Link to="/appointments/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add Appointment
        </Link>
      </button>
    </div>
  );
};

export default AppointmentsList;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ClientsList = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchAllClients = async () => {
      try {
        const res = await axios.get("http://localhost:5000/clients");
        setClients(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllClients();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/clients/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>List of Clients</h1>
      <div className="clients">
        {clients.map((client) => (
          <div key={client.id} className="client">
            <h2>{client.name}</h2>
            <p>{client.phone}</p>
            <p>{client.email}</p>
            <p>{client.notes}</p>
            <button className="delete" onClick={() => handleDelete(client.id)}>Delete</button>
            <button className="update">
              <Link to={`/clients/update/${client.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>
      <button className="addHome">
        <Link to="/clients/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add New Client
        </Link>
      </button>
    </div>
  );
};

export default ClientsList;
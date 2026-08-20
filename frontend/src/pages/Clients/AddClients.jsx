import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AddClients = () => {
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setClient((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/clients", client);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add New Client</h1>
      <input type="text" placeholder="Ex: Karen Nogueira" name="name" onChange={handleChange} />
      <input type="phone" placeholder="Ex: (11) 99999-9999" name="phone" onChange={handleChange} />
      <input type="email" placeholder="Ex: karen.nogueira@example.com" name="email" onChange={handleChange} />
      <input type="text" placeholder="Ex: Karen Nogueira is so nice" name="notes" onChange={handleChange} />
      <button onClick={handleClick}>Add</button>
      {error && "Something went wrong!"}
      <Link to="/">See all clients</Link>
    </div>
  );
};

export default AddClients;
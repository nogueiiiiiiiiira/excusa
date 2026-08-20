import axios from "axios";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const UpdateClient = () => {
  const [client, setClient] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const clientId = location.pathname.split("/")[3];

  const handleChange = (event) => {
    setClient((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/clients/${clientId}`, client);
      navigate("/");
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Update the Client</h1>
      <input type="text" placeholder="Ex: Karen Nogueira" name="name" onChange={handleChange} />
      <input type="phone" placeholder="Ex: (11) 99999-9999" name="phone" onChange={handleChange} />
      <input type="email" placeholder="Ex: karen.nogueira@example.com" name="email" onChange={handleChange} />
      <input type="text" placeholder="Ex: Karen Nogueira is so nice" name="notes" onChange={handleChange} />
      <button onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
      <Link to="/">See all clients</Link>
    </div>
  );
};

export default UpdateClient;
import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UpdateProcedure = () => {
  const [procedure, setProcedure] = useState({
    name: "",
    description: "",
    default_duration: "",
    default_price: "",
  });
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const procedureId = location.pathname.split("/")[3];

  const handleChange = (event) => {
    setProcedure((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:5000/procedures/${procedureId}`, procedure);
      navigate("/procedures");
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Update the Procedure</h1>
      <input type="text" placeholder="Ex: Haircut" name="name" value={procedure.name} onChange={handleChange} />
      <input type="text" placeholder="Ex: A simple haircut" name="description" value={procedure.description} onChange={handleChange} />
      <input type="number" placeholder="Ex: 30" name="default_duration" value={procedure.default_duration} onChange={handleChange} />
      <input type="number" placeholder="Ex: 50.00" name="default_price" value={procedure.default_price} onChange={handleChange} />
      <button onClick={handleClick}>Update</button>
      {error && "Something went wrong!"}
    </div>
  );
};

export default UpdateProcedure;
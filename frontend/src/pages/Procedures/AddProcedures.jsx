import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProcedures = () => {
  const [procedure, setProcedure] = useState({
    name: "",
    description: "",
    default_duration: "",
    default_price: "",
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setProcedure((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:5000/procedures", procedure);
      navigate("/procedures");
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="form">
      <h1>Add New Procedure</h1>
      <input type="text" placeholder="Ex: Haircut" name="name" onChange={handleChange} />
      <input type="text" placeholder="Ex: A stylish haircut for men and women" name="description" onChange={handleChange} />
      <input type="number" placeholder="Ex: 30" name="default_duration" onChange={handleChange} />
      <input type="number" placeholder="Ex: 20.00" name="default_price" onChange={handleChange} />
      <button onClick={handleClick}>Add Procedure</button>
      {error && <span>Something went wrong!</span>}
    </div>
  );
};

export default AddProcedures;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProceduresList = () => {
  const [procedures, setProcedures] = useState([]);

  useEffect(() => {
    const fetchAllProcedures = async () => {
      try {
        const res = await axios.get("http://localhost:5000/procedures");
        setProcedures(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllProcedures();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/procedures/${id}`);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>List of Procedures</h1>
      <div className="procedures">
        {procedures.map((procedure) => (
          <div key={procedure.id} className="procedure">
            <h2>{procedure.name}</h2>
            <p>{procedure.description}</p>
            <p>Duration: {procedure.default_duration} min</p>
            <p>Price: ${procedure.default_price}</p>
            <button className="delete" onClick={() => handleDelete(procedure.id)}>Delete</button>
            <button className="update">
              <Link to={`/procedures/update/${procedure.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                Update
              </Link>
            </button>
          </div>
        ))}
      </div>
      <button className="addHome">
        <Link to="/procedures/add" style={{ color: "inherit", textDecoration: "none" }}>
          Add New Procedure
        </Link>
      </button>
    </div>
  );
};

export default ProceduresList;
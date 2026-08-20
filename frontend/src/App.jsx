import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ClientsList from "./pages/Clients/ClientsList";
import AddClients from "./pages/Clients/AddClients";
import UpdateClient from "./pages/Clients/UpdateClient";
import ProceduresList from "./pages/Procedures/ProceduresList";
import AddProcedures from "./pages/Procedures/AddProcedures";
import UpdateProcedure from "./pages/Procedures/UpdateProcedure";
import AppointmentsList from "./pages/Appointments/AppointmentsList";
import AddAppointments from "./pages/Appointments/AddAppointments";
import UpdateAppointment from "./pages/Appointments/UpdateAppointment";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Clients</Link>
          <Link to="/procedures" style={{ marginRight: "15px" }}>Procedures</Link>
          <Link to="/appointments">Appointments</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ClientsList />} />
          <Route path="/clients/add" element={<AddClients />} />
          <Route path="/clients/update/:id" element={<UpdateClient />} />

          <Route path="/procedures" element={<ProceduresList />} />
          <Route path="/procedures/add" element={<AddProcedures />} />
          <Route path="/procedures/update/:id" element={<UpdateProcedure />} />

          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/appointments/add" element={<AddAppointments />} />
          <Route path="/appointments/update/:id" element={<UpdateAppointment />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
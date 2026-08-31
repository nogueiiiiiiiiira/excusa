import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/General/HomePage";
import ClientsList from "./pages/Clients/ClientsList";
import AddClients from "./pages/Clients/AddClients";
import UpdateClient from "./pages/Clients/UpdateClient";
import ProceduresList from "./pages/Procedures/ProceduresList";
import AddProcedures from "./pages/Procedures/AddProcedures";
import UpdateProcedure from "./pages/Procedures/UpdateProcedure";
import AppointmentsList from "./pages/Appointments/AppointmentsList";
import AddAppointments from "./pages/Appointments/AddAppointments";
import UpdateAppointment from "./pages/Appointments/UpdateAppointment";
import NotFoundPage from "./pages/General/NotFoundPage";
import GeneralHistoryPage from "./pages/General/GeneralHistoryPage";
import SystemHistoryPage from "./pages/General/SystemHistoryPage";

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} /> 
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/clients/add" element={<AddClients />} />
            <Route path="/clients/update/:id" element={<UpdateClient />} />

            <Route path="/procedures" element={<ProceduresList />} />
            <Route path="/procedures/add" element={<AddProcedures />} />
            <Route
              path="/procedures/update/:id"
              element={<UpdateProcedure />}
            />

            <Route path="/appointments" element={<AppointmentsList />} />
            <Route path="/appointments/add" element={<AddAppointments />} />
            <Route
              path="/appointments/update/:id"
              element={<UpdateAppointment />}
            />
            <Route path="/history" element={<GeneralHistoryPage />} />
            <Route path="/history/system" element={<SystemHistoryPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;

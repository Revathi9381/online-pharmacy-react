import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Medicines from "./pages/Medicines";
import Orders from "./pages/Orders";
import Schedule from "./pages/Schedule";
import History from "./pages/History";
import Contact from "./pages/Contact";
import AIReminder from "./pages/AIRemainder";
import Caretaker from "./pages/Caretaker";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/profile" element={<Profile />} />

        <Route path="/medicines" element={<Medicines />} />

        <Route path="/orders" element={<Orders />} />

        <Route path="/schedule" element={<Schedule />} />

        <Route path="/history" element={<History />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/reminder" element={<AIReminder />} />

        <Route path="/caretaker" element={<Caretaker />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
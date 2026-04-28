import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import TenantDashboard from "./pages/tenant/TenantDashboard";
import PropertyDetails from "./pages/tenant/PropertyDetails";
import TenantProfile from "./pages/tenant/TenantProfile";
import TenantMaintenance from "./pages/tenant/TenantMaintenance";

import LandlordDashboard from "./pages/landlord/LandlordDashboard";
import MyProperties from "./pages/landlord/MyProperty";
import BookingRequests from "./pages/landlord/BookingRequests";
import AddProperty from "./pages/landlord/AddProperty";
import LandlordProfile from "./pages/landlord/LandlordProfile";
import LandlordMaintenance from "./pages/landlord/LandlordMaintenance";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/tenant/dashboard" element={<ProtectedRoute allowedRole="tenant"><TenantDashboard /></ProtectedRoute>} />
        <Route path="/tenant/browse" element={<ProtectedRoute allowedRole="tenant"><TenantDashboard /></ProtectedRoute>} />
        <Route path="/tenant/property/:id" element={<ProtectedRoute allowedRole="tenant"><PropertyDetails /></ProtectedRoute>} />
        <Route path="/tenant/profile" element={<ProtectedRoute allowedRole="tenant"><TenantProfile /></ProtectedRoute>} />
        <Route path="/tenant/maintenance" element={<ProtectedRoute allowedRole="tenant"><TenantMaintenance /></ProtectedRoute>} />

        <Route path="/landlord/dashboard" element={<ProtectedRoute allowedRole="landlord"><LandlordDashboard /></ProtectedRoute>} />
        <Route path="/landlord/properties" element={<ProtectedRoute allowedRole="landlord"><MyProperties /></ProtectedRoute>} />
        <Route path="/landlord/requests" element={<ProtectedRoute allowedRole="landlord"><BookingRequests /></ProtectedRoute>} />
        <Route path="/landlord/add-property" element={<ProtectedRoute allowedRole="landlord"><AddProperty /></ProtectedRoute>} />
        <Route path="/landlord/profile" element={<ProtectedRoute allowedRole="landlord"><LandlordProfile /></ProtectedRoute>} />
        <Route path="/landlord/maintenance" element={<ProtectedRoute allowedRole="landlord"><LandlordMaintenance /></ProtectedRoute>} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

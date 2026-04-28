import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getDashboardPath, restoreSession } from "../api/auth";

function ProtectedRoute({ allowedRole, children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;

    restoreSession()
      .then((sessionUser) => {
        if (active) setUser(sessionUser);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Normalize backend "owner" -> frontend "landlord"
  const userRole = user.role === "owner" ? "landlord" : user.role;

  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
}

export default ProtectedRoute;

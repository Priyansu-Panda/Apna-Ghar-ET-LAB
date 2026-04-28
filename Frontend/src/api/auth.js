import api from "./client";

export const toBackendRole = (role) => (role === "landlord" ? "owner" : role);

export const toFrontendRole = (role) => (role === "owner" ? "landlord" : role);

export const getDashboardPath = (role) =>
  (role === "landlord" || role === "owner") ? "/landlord/dashboard" : "/tenant/dashboard";

export const saveAuthUser = (user) => {
  if (!user) return;

  // Normalize role: store "landlord" on frontend even if backend returns "owner"
  const normalized = { ...user, role: toFrontendRole(user.role) };

  localStorage.setItem("user", JSON.stringify(normalized));
  localStorage.setItem("userRole", normalized.role);
  localStorage.setItem("userName", normalized.name || normalized.username || "");
};

export const clearAuthUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
  localStorage.removeItem("userToken");
};

export const login = async ({ email, password, role }) => {
  const response = await api.post("/login", {
    email,
    password,
    role: toBackendRole(role),
  });

  saveAuthUser(response.data.user);
  return response.data.user;
};

export const register = async ({ name, email, phone, password, role }) => {
  const response = await api.post("/register", {
    username: name,
    email,
    phone,
    password,
    role: toBackendRole(role),
  });

  saveAuthUser(response.data.user);
  return response.data.user;
};

export const restoreSession = async () => {
  const response = await api.get("/me");
  saveAuthUser(response.data.user);
  return response.data.user;
};

export const logout = async () => {
  try {
    await api.post("/logout");
  } finally {
    clearAuthUser();
  }
};

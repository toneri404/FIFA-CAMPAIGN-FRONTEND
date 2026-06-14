import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return children;
}

export default AdminRoute;
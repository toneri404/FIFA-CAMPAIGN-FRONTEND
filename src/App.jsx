import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";
import MyPredictions from "./pages/MyPredictions";
import UserProfile
from "./pages/UserProfile";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
  path="/my-predictions"
  element={<MyPredictions />}
/>

<Route
  path="/profile/:id"
  element={<UserProfile />}
/>

<Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
  path="/leaderboard"
  element={<Leaderboard />}
/>

<Route
  path="/profile"
  element={<Profile />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
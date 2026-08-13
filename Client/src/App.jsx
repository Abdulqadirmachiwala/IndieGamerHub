import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import BrowseGames from "./pages/BrowseGames/BrowseGames";
import GameDetails from "./pages/GameDetails/GameDetails";
import Dashboard from "./pages/Dashboard/Dashboard";
import Developer from "./pages/Developer/Developer";
import Admin from "./pages/Admin/Admin";
import NotFound from "./pages/NotFound/NotFound";
import EditGame from "./pages/EditGame/EditGame";
import MyGames from "./pages/MyGames/MyGames";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute";
import ThreadDetail from "./pages/ThreadDetail/ThreadDetail";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/games" element={<BrowseGames />} />

      <Route path="/games/:id" element={<GameDetails />} />
      <Route path="/thread/:id" element={<ThreadDetail />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Developer */}
      <Route
        path="/developer"
        element={
          <ProtectedRoute>
            <Developer />
          </ProtectedRoute>
        }
      />

      {/* My Games */}
      <Route
        path="/my-games"
        element={
          <ProtectedRoute>
            <MyGames />
          </ProtectedRoute>
        }
      />

      {/* Edit Game */}
      <Route
        path="/edit-game/:id"
        element={
          <ProtectedRoute>
            <EditGame />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
     {/* Admin */}
<Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
/>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
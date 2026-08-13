import { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../../components/Navbar/Navbar";
import "./Admin.css";

function Admin() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FETCH ALL GAMES
  // ===============================
  const fetchGames = async () => {
    try {
      const response = await api.get("/games");

      setGames(response.data.games || []);
    } catch (error) {
      console.error("FETCH GAMES ERROR:", error);
      alert(
        error.response?.data?.message ||
          "Failed to load games"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  // ===============================
  // FEATURE / UNFEATURE GAME
  // ===============================
  const handleToggleFeatured = async (gameId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/games/${gameId}/featured`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        response.data.message ||
          "Featured status updated"
      );

      // Refresh games
      fetchGames();
    } catch (error) {
      console.error(
        "FEATURE GAME ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update featured status"
      );
    }
  };

  // ===============================
  // DELETE GAME
  // ===============================
  const handleDeleteGame = async (gameId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this game?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/games/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Game deleted successfully");

      setGames((prevGames) =>
        prevGames.filter(
          (game) => game._id !== gameId
        )
      );
    } catch (error) {
      console.error(
        "DELETE GAME ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to delete game"
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-page">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>

          <p>
            Manage games and featured content
          </p>
        </div>

        <div className="admin-section">
          <h2>🎮 Manage Games</h2>

          {loading ? (
            <p className="admin-loading">
              Loading games...
            </p>
          ) : games.length === 0 ? (
            <p className="admin-empty">
              No games available.
            </p>
          ) : (
            <div className="admin-games">
              {games.map((game) => (
                <div
                  className="admin-game-card"
                  key={game._id}
                >
                  <div className="admin-game-info">
                    {game.coverImage ? (
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="admin-game-image"
                      />
                    ) : (
                      <div className="admin-game-placeholder">
                        🎮
                      </div>
                    )}

                    <div>
                      <h3>{game.title}</h3>

                      <p>
                        {game.genre}
                      </p>

                      <span>
                        {game.platform}
                      </span>
                    </div>
                  </div>

                  <div className="admin-game-actions">
                    <button
                      className={
                        game.isFeatured
                          ? "featured-btn active"
                          : "featured-btn"
                      }
                      onClick={() =>
                        handleToggleFeatured(
                          game._id
                        )
                      }
                    >
                      {game.isFeatured
                        ? "⭐ Featured"
                        : "☆ Make Featured"}
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDeleteGame(
                          game._id
                        )
                      }
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Admin;
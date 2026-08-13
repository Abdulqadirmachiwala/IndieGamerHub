import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./BrowseGames.css";

function BrowseGames() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [price, setPrice] = useState("All");

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await api.get("/games");
      setGames(res.data.games);
    } catch (error) {
      console.log(error);
      alert("Failed to load games");
    } finally {
      setLoading(false);
    }
  };

  const deleteGame = async (id) => {
    if (!window.confirm("Are you sure you want to delete this game?")) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/games/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Game Deleted Successfully");
      fetchGames();
    } catch (error) {
      alert(error.response?.data?.message || "Delete Failed");
    }
  };

 const filteredGames = games.filter((game) => {
  const matchSearch = game.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchGenre =
    genre === "All" ||
    (Array.isArray(game.genre)
      ? game.genre.includes(genre)
      : game.genre === genre);

  const gamePrice = Number(game.price || 0);

  let matchPrice = true;

  if (price === "Free") {
    matchPrice = gamePrice === 0;
  }

  if (price === "0-500") {
    matchPrice = gamePrice > 0 && gamePrice <= 500;
  }

  if (price === "500-1000") {
    matchPrice = gamePrice > 500 && gamePrice <= 1000;
  }

  if (price === "1000+") {
    matchPrice = gamePrice > 1000;
  }

  return matchSearch && matchGenre && matchPrice;
});
  if (loading) {
    return (
      <div className="browse-container">
        <h2>Loading Games...</h2>
      </div>
    );
  }

  return (
    <div className="browse-container">
      <h1 className="browse-title">Browse Games</h1>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search Games..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "400px",
            padding: "12px 18px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
          }}
        />
      </div>

      {/* Genre Filter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{
            width: "250px",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          <option value="All">All Genres</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="RPG">RPG</option>
          <option value="Horror">Horror</option>
          <option value="Puzzle">Puzzle</option>
          <option value="Sports">Sports</option>
          <option value="Racing">Racing</option>
          <option value="Strategy">Strategy</option>
        </select>
      </div>
      {/* Price Filter */}
<div
  style={{
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  }}
>
  <select
    value={price}
    onChange={(e) => setPrice(e.target.value)}
    style={{
      width: "250px",
      padding: "12px",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
    }}
  >
    <option value="All">All Prices</option>
    <option value="Free">Free</option>
    <option value="0-500">₹1 - ₹500</option>
    <option value="500-1000">₹501 - ₹1000</option>
    <option value="1000+">₹1000+</option>
  </select>
</div>

      {filteredGames.length === 0 ? (
        <h2 style={{ textAlign: "center" }}>No Games Found</h2>
      ) : (
        <div className="games-grid">
          {filteredGames.map((game) => (
            <div className="game-card" key={game._id}>
              <img
                src={
                  game.coverImage ||
                  "https://placehold.co/600x400?text=Game+Cover"
                }
                alt={game.title}
                className="game-image"
              />

              <div className="game-content">
                <h2>{game.title}</h2>

                <p>{game.description}</p>

                <p className="genre">
                  <strong>Genre:</strong> {game.genre}
                </p>

                <p className="platform">
                  <strong>Platform:</strong> {game.platform}
                </p>

                <p className="developer">
                  <strong>Developer:</strong> {game.developer?.name}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >
                  <Link
  to={`/games/${game._id}`}
  className="view-btn"
>
                    View
                  </Link>

                  {user && (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/edit-game/${game._id}`)
                        }
                        style={{
                          padding: "10px 18px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#f59e0b",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteGame(game._id)}
                        style={{
                          padding: "10px 18px",
                          border: "none",
                          borderRadius: "8px",
                          background: "#ef4444",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseGames;
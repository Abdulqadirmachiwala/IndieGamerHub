import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import api from "../../services/api";
import "./Home.css";

function Home() {
  const [games, setGames] = useState([]);
  const [trendingGames, setTrendingGames] = useState([]);

  const [loading, setLoading] = useState(true);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // ===============================
  // FETCH ALL GAMES
  // ===============================
  useEffect(() => {
    fetchGames();
    fetchTrendingGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await api.get("/games");

      setGames(res.data.games || []);
    } catch (error) {
      console.error("Failed to load games:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // FETCH TRENDING GAMES
  // ===============================
  const fetchTrendingGames = async () => {
    try {
      const res = await api.get("/reviews/trending");

      setTrendingGames(res.data.games || []);
    } catch (error) {
      console.error("Failed to load trending games:", error);
      setTrendingGames([]);
    } finally {
      setTrendingLoading(false);
    }
  };

  // ===============================
  // LATEST GAMES
  // ===============================
  const latestGames = games.slice(0, 6);

  // ===============================
  // UPCOMING GAMES
  // ===============================
  const upcomingGames = games
    .filter((game) => {
      if (!game.releaseDate) return false;

      const releaseDate = new Date(game.releaseDate);

      return (
        !isNaN(releaseDate.getTime()) &&
        releaseDate > new Date()
      );
    })
    .slice(0, 6);

  // ===============================
  // FEATURED GAMES
  // ===============================
  const featuredGames = games
    .filter((game) => game.isFeatured === true)
    .slice(0, 4);

  // ===============================
  // GAME CARD
  // ===============================
  const GameCard = ({ game }) => {
    return (
      <Link
        to={`/games/${game._id}`}
        className="home-game-card"
      >
        <img
          src={
            game.coverImage ||
            "https://placehold.co/600x340?text=Game+Cover"
          }
          alt={game.title}
        />

        <div className="home-game-info">
          <h3>{game.title}</h3>

          <p>
            {Array.isArray(game.genre)
              ? game.genre.join(", ")
              : game.genre || "Indie Game"}
          </p>

          <div className="home-game-bottom">
            <span>
              {game.price === 0
                ? "FREE"
                : `₹${game.price}`}
            </span>

            {game.reviewCount !== undefined ? (
              <span>
                🔥 {game.reviewCount} reviews
              </span>
            ) : (
              <span>
                ⭐{" "}
                {Number(
                  game.averageRating || 0
                ).toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <Navbar />

      {/* ===============================
          HERO
      =============================== */}
      <section className="hero">
        <h1>
          Discover Amazing
          <span> Indie Games</span>
        </h1>

        <p>
          The Ultimate Community for Gamers and
          Indie Developers.
        </p>

        <Link
          to="/games"
          className="hero-button"
        >
          Explore Games
        </Link>
      </section>

      {/* ===============================
          FEATURED GAMES
      =============================== */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-label">
              ⭐ FEATURED
            </span>

            <h2>Featured Games</h2>

            <p>
              Discover games selected for the
              IndieGamer community.
            </p>
          </div>

          <Link
            to="/games"
            className="view-all"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="home-message">
            Loading games...
          </p>
        ) : featuredGames.length > 0 ? (
          <div className="games-grid">
            {featuredGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
              />
            ))}
          </div>
        ) : (
          <div className="home-message">
            <span>⭐</span>

            <h3>No Featured Games Yet</h3>

            <p>
              Featured games will appear here.
            </p>
          </div>
        )}
      </section>

      {/* ===============================
          TRENDING GAMES
      =============================== */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-label">
              🔥 TRENDING
            </span>

            <h2>Trending Games</h2>

            <p>
              Games receiving the most reviews
              in the last 7 days.
            </p>
          </div>

          <Link
            to="/games"
            className="view-all"
          >
            View All →
          </Link>
        </div>

        {trendingLoading ? (
          <p className="home-message">
            Loading trending games...
          </p>
        ) : trendingGames.length > 0 ? (
          <div className="games-grid">
            {trendingGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
              />
            ))}
          </div>
        ) : (
          <div className="home-message">
            <span>🔥</span>

            <h3>No Trending Games Yet</h3>

            <p>
              Games with recent reviews will
              appear here.
            </p>
          </div>
        )}
      </section>

      {/* ===============================
          LATEST GAMES
      =============================== */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-label">
              🆕 LATEST
            </span>

            <h2>Latest Games</h2>

            <p>
              Check out the newest games
              published by developers.
            </p>
          </div>

          <Link
            to="/games"
            className="view-all"
          >
            View All →
          </Link>
        </div>

        {!loading && latestGames.length > 0 ? (
          <div className="games-grid">
            {latestGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
              />
            ))}
          </div>
        ) : (
          <div className="home-message">
            <span>🎮</span>

            <h3>No Games Available</h3>
          </div>
        )}
      </section>

      {/* ===============================
          UPCOMING GAMES
      =============================== */}
      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-label">
              🚀 UPCOMING
            </span>

            <h2>Upcoming Games</h2>

            <p>
              Keep an eye on games releasing
              soon.
            </p>
          </div>

          <Link
            to="/games"
            className="view-all"
          >
            View All →
          </Link>
        </div>

        {upcomingGames.length > 0 ? (
          <div className="games-grid">
            {upcomingGames.map((game) => (
              <GameCard
                key={game._id}
                game={game}
              />
            ))}
          </div>
        ) : (
          <div className="home-message">
            <span>🚀</span>

            <h3>No Upcoming Games</h3>

            <p>
              Upcoming games will appear here.
            </p>
          </div>
        )}
      </section>

      <Footer />
    </>
  );
}

export default Home;
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import api from "../../services/api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState({
    totalGames: 0,
    totalReviews: 0,
    averageRating: 0,
    featuredGames: 0,
  });

  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get all games
      const gamesRes = await api.get("/games");
      const games = gamesRes.data.games || [];

      // Get all reviews
      const reviewsRes = await api.get("/reviews");
      const reviews = reviewsRes.data.reviews || [];

      // Calculate average rating
      let averageRating = 0;

      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (sum, review) => sum + Number(review.rating),
          0
        );

        averageRating = (
          totalRating / reviews.length
        ).toFixed(1);
      }

      // Latest 5 reviews
      setRecentReviews(reviews.slice(0, 5));

      // Dashboard statistics
      setStats({
        totalGames: games.length,
        totalReviews: reviews.length,
        averageRating,
        featuredGames: games.filter(
          (game) => game.isFeatured === true
        ).length,
      });
    } catch (error) {
      console.log("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          background: "#0d1117",
          color: "white",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ marginBottom: "20px" }}>
          Welcome {user?.name} 👋
        </h1>

        <h3
          style={{
            marginBottom: "30px",
            color: "#00E5FF",
          }}
        >
          Role : {user?.role}
        </h3>

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginBottom: "30px",
          }}
        >
          Logout
        </button>

        {/* ADMIN PANEL BUTTON */}
        {user?.role === "admin" && (
          <button
            onClick={() => {
              window.location.href = "/admin";
            }}
            style={{
              padding: "10px 20px",
              background: "#6366f1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginBottom: "30px",
              marginLeft: "10px",
            }}
          >
            👑 Admin Panel
          </button>
        )}

        {loading ? (
          <h2>Loading Dashboard...</h2>
        ) : (
          <>
            {/* ===============================
                DASHBOARD STATS
            =============================== */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit,minmax(250px,1fr))",
                gap: "20px",
              }}
            >
              {/* Total Games */}
              <div
                style={{
                  background: "#161b22",
                  padding: "25px",
                  borderRadius: "12px",
                }}
              >
                <h2>Total Games</h2>
                <h1>{stats.totalGames}</h1>
              </div>

              {/* Total Reviews */}
              <div
                style={{
                  background: "#161b22",
                  padding: "25px",
                  borderRadius: "12px",
                }}
              >
                <h2>Total Reviews</h2>
                <h1>{stats.totalReviews}</h1>
              </div>

              {/* Average Rating */}
              <div
                style={{
                  background: "#161b22",
                  padding: "25px",
                  borderRadius: "12px",
                }}
              >
                <h2>Average Rating</h2>
                <h1>{stats.averageRating} ⭐</h1>
              </div>

              {/* Featured Games */}
              <div
                style={{
                  background: "#161b22",
                  padding: "25px",
                  borderRadius: "12px",
                }}
              >
                <h2>Featured Games</h2>
                <h1>{stats.featuredGames}</h1>
              </div>
            </div>

            {/* ===============================
                RECENT ACTIVITY
            =============================== */}

            <div
              style={{
                marginTop: "40px",
                background: "#161b22",
                padding: "30px",
                borderRadius: "12px",
              }}
            >
              <h2>Recent Activity</h2>

              {recentReviews.length === 0 ? (
                <p
                  style={{
                    marginTop: "20px",
                    color: "#aaa",
                  }}
                >
                  No activity yet...
                </p>
              ) : (
                <div style={{ marginTop: "20px" }}>
                  {recentReviews.map((review) => (
                    <div
                      key={review._id}
                      style={{
                        padding: "18px 0",
                        borderBottom:
                          "1px solid #30363d",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>
                          {review.user?.name || "User"}
                        </strong>

                        <span
                          style={{
                            color: "#ffd700",
                            letterSpacing: "2px",
                          }}
                        >
                          {"⭐".repeat(
                            Number(review.rating)
                          )}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "10px 0",
                          color: "#c9d1d9",
                        }}
                      >
                        {review.comment}
                      </p>

                      <small
                        style={{
                          color: "#8b949e",
                        }}
                      >
                        {review.game?.title || "Game"}{" "}
                        •{" "}
                        {new Date(
                          review.createdAt
                        ).toLocaleDateString()}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
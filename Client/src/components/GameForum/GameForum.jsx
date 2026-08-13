import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import "./GameForum.css";

function GameForum({ gameId }) {
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const token = localStorage.getItem("token");

  // ===============================
  // FETCH THREADS
  // ===============================
  useEffect(() => {
    if (gameId) {
      fetchThreads();
    }
  }, [gameId]);

  const fetchThreads = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/threads/game/${gameId}`);

      setThreads(res.data.threads || []);
    } catch (error) {
      console.error("Fetch Threads Error:", error);

      setThreads([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CREATE THREAD
  // ===============================
  const handleCreateThread = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to create a discussion");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a discussion title");
      return;
    }

    try {
      setCreating(true);

      await api.post(
        `/threads/${gameId}`,
        {
          title: title.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Discussion Created Successfully");

      setTitle("");

      await fetchThreads();
    } catch (error) {
      console.error("Create Thread Error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create discussion"
      );
    } finally {
      setCreating(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <section className="forum-section">
        <div className="forum-header">
          <span>💬</span>
          <div>
            <h2>Community Discussion</h2>
            <p>Loading discussions...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="forum-section">

      {/* ===============================
          HEADER
      =============================== */}
      <div className="forum-header">
        <span>💬</span>

        <div>
          <h2>Community Discussion</h2>
          <p>
            Talk with other gamers about this game.
          </p>
        </div>
      </div>

      {/* ===============================
          CREATE THREAD
      =============================== */}
      {token ? (
        <form
          className="create-thread-form"
          onSubmit={handleCreateThread}
        >
          <h3>Start a Discussion</h3>

          <input
            type="text"
            placeholder="Discussion title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={150}
          />

          <button
            type="submit"
            disabled={creating}
          >
            {creating
              ? "Creating..."
              : "➕ Create Discussion"}
          </button>
        </form>
      ) : (
        <div className="forum-login-box">
          <p>
            🔐 Please login to start a discussion.
          </p>

          <Link
            to="/login"
            className="forum-login-btn"
          >
            Login
          </Link>
        </div>
      )}

      {/* ===============================
          THREAD LIST
      =============================== */}
      <div className="threads-container">

        <div className="threads-title">
          <h3>
            Discussions ({threads.length})
          </h3>
        </div>

        {threads.length === 0 ? (
          <div className="no-threads">
            <span>💬</span>

            <h3>No discussions yet</h3>

            <p>
              Be the first gamer to start a discussion!
            </p>
          </div>
        ) : (
          <div className="thread-list">

            {threads.map((thread) => (
              <div
                className="thread-card"
                key={thread._id}
              >
                <div className="thread-icon">
                  💬
                </div>

                <div className="thread-content">

                  <Link
                    to={`/thread/${thread._id}`}
                    className="thread-title"
                  >
                    {thread.title}
                  </Link>

                  <div className="thread-meta">

                    <span>
                      👤{" "}
                      {thread.author?.name ||
                        "User"}
                    </span>

                    <span>
                      📅{" "}
                      {thread.createdAt
                        ? new Date(
                            thread.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </span>

                  </div>

                </div>

                <div className="thread-arrow">
                  ❯
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
}

export default GameForum;
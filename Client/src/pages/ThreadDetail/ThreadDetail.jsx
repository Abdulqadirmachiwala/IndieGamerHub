import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../services/api";
import "./ThreadDetail.css";

function ThreadDetail() {
  const { id } = useParams();

  const [thread, setThread] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      setLoading(true);

      const res = await api.get(`/threads/${id}`);

      setThread(res.data.thread);
      setPosts(res.data.posts || []);
    } catch (error) {
      console.error("Fetch Thread Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="thread-detail-container">
        <h2>Loading Discussion...</h2>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="thread-detail-container">
        <h2>Discussion Not Found</h2>

        <Link to="/games" className="back-btn">
          ← Back to Games
        </Link>
      </div>
    );
  }

  return (
    <div className="thread-detail-container">

      <Link to={`/games`} className="back-btn">
        ← Back to Games
      </Link>

      <div className="thread-detail-header">
        <span>💬</span>

        <div>
          <h1>{thread.title}</h1>

          <p>
            Started by{" "}
            <strong>
              {thread.author?.name || "User"}
            </strong>
          </p>

          {thread.game?.title && (
            <p>
              Game: <strong>{thread.game.title}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="posts-section">
        <h2>
          Discussion ({posts.length})
        </h2>

        {posts.length === 0 ? (
          <div className="no-posts">
            <span>💬</span>
            <h3>No replies yet</h3>
            <p>Be the first to reply to this discussion.</p>
          </div>
        ) : (
          <div className="posts-list">
            {posts.map((post) => (
              <div className="post-card" key={post._id}>
                <div className="post-author">
                  👤 {post.author?.name || "User"}
                </div>

                <div className="post-content">
                  {post.content}
                </div>

                <div className="post-date">
                  {post.createdAt
                    ? new Date(
                        post.createdAt
                      ).toLocaleString()
                    : ""}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ThreadDetail;
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";


import api from "../../services/api";
import ReactPlayer from "react-player";
import "./GameDetails.css";
import GameForum from "../../components/GameForum/GameForum";
function GameDetails() {
  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  // =========================
  // ADD REVIEW STATE
  // =========================
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // EDIT REVIEW STATE
  // =========================
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [updatingReview, setUpdatingReview] = useState(false);

 const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

const currentUserId = user?._id || user?.id || user?.userId;
  useEffect(() => {
    fetchGame();
    fetchReviews();
  }, [id]);

  // =========================
  // FETCH GAME
  // =========================
  const fetchGame = async () => {
    try {
      const res = await api.get(`/games/${id}`);
      setGame(res.data.game);
    } catch (error) {
      console.log("Game Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data.reviews || []);
    } catch (error) {
      console.log("Failed to load reviews", error);
    }
  };

  // =========================
  // ADD REVIEW
  // =========================
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Please login to add a review");
      return;
    }

    if (!comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        `/reviews/${id}`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review Added Successfully");

      setRating(5);
      setComment("");

      fetchReviews();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to add review"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // START EDIT REVIEW
  // =========================
  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setEditRating(Number(review.rating));
    setEditComment(review.comment);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(5);
    setEditComment("");
  };

  // =========================
  // UPDATE REVIEW
  // =========================
  const handleUpdateReview = async (reviewId) => {
    if (!editComment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      setUpdatingReview(true);

      await api.put(
        `/reviews/${reviewId}`,
        {
          rating: editRating,
          comment: editComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review Updated Successfully");

      handleCancelEdit();
      fetchReviews();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update review"
      );
    } finally {
      setUpdatingReview(false);
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const handleDeleteReview = async (reviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Review Deleted Successfully");

      fetchReviews();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete review"
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="details-container loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading Game...</h2>
      </div>
    );
  }

  // =========================
  // GAME NOT FOUND
  // =========================
  if (!game) {
    return (
      <div className="details-container not-found">
        <h2>🎮 Game Not Found</h2>

        <Link to="/games" className="back-btn">
          ← Back to Games
        </Link>
      </div>
    );
  }

  // =========================
  // AVERAGE RATING
  // =========================
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) =>
              sum + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : "0.0";

  // =========================
  // OPTIONAL GAME DATA
  // =========================
  const screenshots = Array.isArray(game.screenshots)
    ? game.screenshots
    : [];

  const tags = Array.isArray(game.tags)
    ? game.tags
    : [];

  return (
    <div className="details-container">

      {/* =================================
          HERO / GAME DETAILS
      ================================= */}

      <div className="details-card">

        {/* GAME IMAGE */}
        <div className="details-image-wrapper">

          <div className="game-gallery">

            <div className="main-image-container">

              <img
                src={
                  game.screenshots?.length > 0
                    ? game.screenshots[currentImage]
                    : game.coverImage ||
                      "https://placehold.co/700x400?text=Game+Cover"
                }
                alt={game.title}
                className="details-image"
              />

              {game.screenshots?.length > 1 && (
                <>
                  <button
                    className="carousel-btn prev-btn"
                    onClick={() =>
                      setCurrentImage(
                        currentImage === 0
                          ? game.screenshots.length - 1
                          : currentImage - 1
                      )
                    }
                  >
                    ❮
                  </button>

                  <button
                    className="carousel-btn next-btn"
                    onClick={() =>
                      setCurrentImage(
                        currentImage ===
                        game.screenshots.length - 1
                          ? 0
                          : currentImage + 1
                      )
                    }
                  >
                    ❯
                  </button>
                </>
              )}

            </div>

            {game.screenshots?.length > 0 && (
              <div className="thumbnail-container">

                {game.screenshots.map(
                  (image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${game.title} screenshot ${
                        index + 1
                      }`}
                    className={`game-thumbnail ${
            currentImage === index
              ? "active-thumbnail"
              : ""
          }`}
          loading="lazy"
          onClick={() =>
                        setCurrentImage(index)
                      }
                    />
                  )
                )}

              </div>
            )}

          </div>

          <div className="image-overlay">
            <span>🎮 Indie Game</span>
          </div>

        </div>

        {/* GAME INFORMATION */}
        <div className="details-content">

          <div className="game-badge">
            INDIE GAMER HUB
          </div>

          <h1>{game.title}</h1>

          <div className="rating-summary">

            <span className="big-stars">
              {averageRating !== "0.0"
                ? "⭐".repeat(
                    Math.round(
                      Number(averageRating)
                    )
                  )
                : "☆☆☆☆☆"}
            </span>

            <strong>
              {averageRating} / 5
            </strong>

            <span className="review-count">
              ({reviews.length}{" "}
              {reviews.length === 1
                ? "review"
                : "reviews"})
            </span>

          </div>

          <p className="game-description">
            {game.description}
          </p>

          {/* GAME INFORMATION */}
          <div className="game-info-grid">

            <div className="info-box">
              <span>🎯</span>

              <div>
                <small>Genre</small>

                <strong>
                  {Array.isArray(game.genre)
                    ? game.genre.join(", ")
                    : game.genre ||
                      "Not specified"}
                </strong>
              </div>
            </div>

            <div className="info-box">
              <span>🖥️</span>

              <div>
                <small>Platform</small>

                <strong>
                  {game.platform || "PC"}
                </strong>
              </div>
            </div>

            <div className="info-box">
              <span>👨‍💻</span>

              <div>
                <small>Developer</small>

                <strong>
                  {game.developer?.name ||
                    "Independent Developer"}
                </strong>
              </div>
            </div>

            <div className="info-box">
              <span>📅</span>

              <div>
                <small>Release Date</small>

                <strong>
                  {game.releaseDate
                    ? new Date(
                        game.releaseDate
                      ).toLocaleDateString()
                    : "Coming Soon"}
                </strong>
              </div>
            </div>

          </div>

          {/* PRICE */}
          {game.price !== undefined &&
            game.price !== null && (
              <div className="price-box">

                <span>Price</span>

                <strong>
                  {game.price === 0
                    ? "FREE"
                    : `₹${game.price}`}
                </strong>

              </div>
            )}

          {/* TAGS */}
          {tags.length > 0 && (
            <div className="tags-section">

              {tags.map((tag, index) => (
                <span key={index}>
                  #{tag}
                </span>
              ))}

            </div>
          )}

          {/* BUTTONS */}
         <div className="details-actions">

  {/* STEAM */}
  {game.storeLinks?.steamAffiliate ||
  game.storeLinks?.steam ? (
    <a
      href={
        game.storeLinks?.steamAffiliate ||
        game.storeLinks?.steam
      }
      target="_blank"
      rel="noopener noreferrer"
      className="buy-btn"
    >
      🛒 Buy on Steam
    </a>
  ) : (
    <button
      className="buy-btn disabled-btn"
      disabled
    >
      🛒 Steam Link Coming Soon
    </button>
  )}

  {/* EPIC GAMES */}
  {game.storeLinks?.epicAffiliate ||
  game.storeLinks?.epic ? (
    <a
      href={
        game.storeLinks?.epicAffiliate ||
        game.storeLinks?.epic
      }
      target="_blank"
      rel="noopener noreferrer"
      className="buy-btn"
    >
      🎮 Buy on Epic Games
    </a>
  ) : null}

  {/* ITCH.IO */}
  {game.storeLinks?.itchAffiliate ||
  game.storeLinks?.itch ? (
    <a
      href={
        game.storeLinks?.itchAffiliate ||
        game.storeLinks?.itch
      }
      target="_blank"
      rel="noopener noreferrer"
      className="buy-btn"
    >
      🕹️ Get on Itch.io
    </a>
  ) : null}

  <Link
    to="/games"
    className="back-btn"
  >
    ← Back to Games
  </Link>

</div>

        </div>
      </div>

      {/* =================================
          SCREENSHOTS
      ================================= */}

      <div className="media-section">

        <div className="section-heading">

          <span>📸</span>

          <div>
            <h2>Game Screenshots</h2>

            <p>
              Explore the world of {game.title}
            </p>
          </div>

        </div>

        {screenshots.length > 0 ? (
          <div className="screenshots-grid">

            {screenshots.map(
              (image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${game.title} screenshot ${
            index + 1
          }`}
          loading="lazy"
        />
              )
            )}

          </div>
        ) : (
          <div className="media-placeholder">

            <span>📸</span>

            <h3>
              Screenshots Coming Soon
            </h3>

            <p>
              Game screenshots will appear here.
            </p>

          </div>
        )}

      </div>

      {/* =================================
          TRAILER
      ================================= */}

      <div className="media-section">

        <div className="section-heading">

          <span>🎬</span>

          <div>
            <h2>Game Trailer</h2>

            <p>
              Watch the latest trailer
            </p>
          </div>

        </div>

      {game.trailer ? (
  <div className="trailer-container">
    <ReactPlayer
  src={game.trailer}
  controls
  width="100%"
  height="100%"
/>
  </div>
) : (
  <div className="media-placeholder">
    <span>🎬</span>
    <h3>Trailer Coming Soon</h3>
    <p>
      A game trailer will appear here.
    </p>
  </div>
)}

      </div>
{/* =================================
    REVIEWS SECTION
================================= */}

<div className="reviews-section">

  {/* SECTION HEADER */}
  <div className="section-heading">

    <span>⭐</span>

    <div>
      <h2>Reviews & Ratings</h2>

      <p>
        See what gamers think about this game.
      </p>
    </div>

  </div>


  {/* =================================
      ADD REVIEW
  ================================= */}

  {user ? (

    <form
      onSubmit={handleReviewSubmit}
      className="review-form"
    >

      <h3>Write a Review</h3>

      {/* RATING */}

      <label>Rating</label>

      <select
        value={rating}
        onChange={(e) =>
          setRating(Number(e.target.value))
        }
      >

        <option value="5">
          ⭐⭐⭐⭐⭐ - 5
        </option>

        <option value="4">
          ⭐⭐⭐⭐ - 4
        </option>

        <option value="3">
          ⭐⭐⭐ - 3
        </option>

        <option value="2">
          ⭐⭐ - 2
        </option>

        <option value="1">
          ⭐ - 1
        </option>

      </select>


      {/* COMMENT */}

      <textarea
        placeholder="Share your experience with this game..."
        value={comment}
        onChange={(e) =>
          setComment(e.target.value)
        }
        rows="4"
      />


      {/* SUBMIT */}

      <button
        type="submit"
        disabled={submitting}
      >
        {submitting
          ? "Submitting..."
          : "Submit Review"}
      </button>

    </form>

  ) : (

    <div className="login-review-box">

      <p>
        🔐 Please login to write a review.
      </p>

      <Link
        to="/login"
        className="login-review-btn"
      >
        Login
      </Link>

    </div>

  )}


  {/* =================================
      REVIEWS LIST
  ================================= */}

  <div className="reviews-list">

    <h3>
      {reviews.length} Review
      {reviews.length !== 1 ? "s" : ""}
    </h3>


    {/* NO REVIEWS */}

    {reviews.length === 0 ? (

      <div className="empty-reviews">

        <span>💬</span>

        <p>
          No reviews yet.
        </p>

        <small>
          Be the first gamer to review
          this game!
        </small>

      </div>

    ) : (

      /* REVIEWS */

      reviews.map((review) => (

        <div
          className="review-card"
          key={review._id}
        >

          {/* =================================
              EDIT MODE
          ================================= */}

          {editingReviewId === review._id ? (

            <div className="edit-review-form">

              <h4>
                Edit Your Review
              </h4>


              {/* EDIT RATING */}

              <label>
                Rating
              </label>

              <select
                value={editRating}
                onChange={(e) =>
                  setEditRating(
                    Number(e.target.value)
                  )
                }
              >

                <option value="5">
                  ⭐⭐⭐⭐⭐ - 5
                </option>

                <option value="4">
                  ⭐⭐⭐⭐ - 4
                </option>

                <option value="3">
                  ⭐⭐⭐ - 3
                </option>

                <option value="2">
                  ⭐⭐ - 2
                </option>

                <option value="1">
                  ⭐ - 1
                </option>

              </select>


              {/* EDIT COMMENT */}

              <textarea
                value={editComment}
                onChange={(e) =>
                  setEditComment(e.target.value)
                }
                rows="4"
                placeholder="Edit your review..."
              />


              {/* EDIT BUTTONS */}

              <div className="edit-review-actions">

                <button
                  type="button"
                  onClick={() =>
                    handleUpdateReview(review._id)
                  }
                  disabled={updatingReview}
                  className="save-review-btn"
                >
                  {updatingReview
                    ? "Saving..."
                    : "💾 Save Changes"}
                </button>


                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="cancel-review-btn"
                  disabled={updatingReview}
                >
                  ❌ Cancel
                </button>

              </div>

            </div>

          ) : (

            /* =================================
               NORMAL REVIEW
            ================================= */

            <>

              <div className="review-header">

                <div>

                  <h4>
                    {review.user?.name || "User"}
                  </h4>

                  <div className="review-rating">

                    {"⭐".repeat(
                      Math.max(
                        0,
                        Math.min(
                          5,
                          Number(review.rating) || 0
                        )
                      )
                    )}

                  </div>

                </div>


                <small>
                  {review.createdAt
                    ? new Date(
                        review.createdAt
                      ).toLocaleDateString()
                    : ""}
                </small>

              </div>


              <p className="review-comment">
                {review.comment}
              </p>


              {/* =================================
                  USER REVIEW ACTIONS
              ================================= */}

              {currentUserId &&
                review.user?._id &&
                String(review.user._id) ===
                  String(currentUserId) && (

                <div className="review-actions">

                  <button
                    type="button"
                    onClick={() =>
                      handleEditReview(review)
                    }
                    className="edit-review-btn"
                  >
                    ✏️ Edit
                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteReview(review._id)
                    }
                    className="delete-review-btn"
                  >
                    🗑 Delete
                  </button>

                </div>

              )}

            </>

          )}

        </div>

      ))

    )}

  </div>

</div>


{/* =================================
    COMMUNITY FORUM
================================= */}

<GameForum gameId={id} />


</div>
);
}

export default GameDetails;
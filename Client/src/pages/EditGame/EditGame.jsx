import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../services/api";
import "./EditGame.css";

function EditGame() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ===============================
  // FORM STATE
  // ===============================
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    platform: "",
    steamAppId: "",
    screenshots: "",
    trailer: "",
    price: "",
    releaseDate: "",
    tags: "",
   steamLink: "",
steamAffiliateLink: "",

epicLink: "",
epicAffiliateLink: "",

itchLink: "",
itchAffiliateLink: "",

coverImage: "",
  });

  // ===============================
  // PAGE STATES
  // ===============================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ===============================
  // FETCH GAME
  // ===============================
  useEffect(() => {
    fetchGame();
  }, [id]);

  const fetchGame = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(`/games/${id}`);

      const game = res.data.game;

      if (!game) {
        setError("Game not found");
        return;
      }

      // Convert screenshots array to comma-separated text
      const screenshotsText = Array.isArray(game.screenshots)
        ? game.screenshots.join(", ")
        : "";

      // Convert tags array to comma-separated text
      const tagsText = Array.isArray(game.tags)
        ? game.tags.join(", ")
        : "";

      // Genre can be array or string
      const genreText = Array.isArray(game.genre)
        ? game.genre.join(", ")
        : game.genre || "";

      setFormData({
        title: game.title || "",
        description: game.description || "",
        genre: genreText,
        platform: game.platform || "",
        steamAppId: game.steamAppId || "",
        screenshots: screenshotsText,
        trailer: game.trailer || "",
        price:
          game.price !== undefined && game.price !== null
            ? game.price
            : "",
        releaseDate: game.releaseDate
          ? String(game.releaseDate).substring(0, 10)
          : "",
        tags: tagsText,
       steamLink: game.storeLinks?.steam || "",
steamAffiliateLink: game.storeLinks?.steamAffiliate || "",

epicLink: game.storeLinks?.epic || "",
epicAffiliateLink: game.storeLinks?.epicAffiliate || "",

itchLink: game.storeLinks?.itch || "",
itchAffiliateLink: game.storeLinks?.itchAffiliate || "",

coverImage: game.coverImage || "",
      });
    } catch (error) {
      console.error("FETCH GAME ERROR:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load game"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ===============================
  // HANDLE UPDATE
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert("Please enter game title");
      return;
    }

    if (!formData.description.trim()) {
      alert("Please enter game description");
      return;
    }

    if (!formData.genre.trim()) {
      alert("Please enter game genre");
      return;
    }

    if (!formData.platform.trim()) {
      alert("Please enter game platform");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      // Convert screenshots text → array
      const screenshotsArray = formData.screenshots
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      // Convert tags text → array
      const tagsArray = formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      // Convert genre text → array
      const genreArray = formData.genre
        .split(",")
        .map((genre) => genre.trim())
        .filter((genre) => genre !== "");

      const updateData = {
        title: formData.title.trim(),

        description: formData.description.trim(),
genre: genreArray,

        platform: formData.platform.trim(),

        steamAppId: formData.steamAppId.trim(),

        coverImage: formData.coverImage.trim(),

        screenshots: screenshotsArray,

        trailer: formData.trailer.trim(),

        price:
          formData.price === ""
            ? 0
            : Number(formData.price),

        releaseDate: formData.releaseDate,

        tags: tagsArray,

       storeLinks: {
  steam: formData.steamLink.trim(),
  steamAffiliate: formData.steamAffiliateLink.trim(),

  epic: formData.epicLink.trim(),
  epicAffiliate: formData.epicAffiliateLink.trim(),

  itch: formData.itchLink.trim(),
  itchAffiliate: formData.itchAffiliateLink.trim(),
},
      };

      console.log("========== UPDATE GAME DATA ==========");
      console.log(updateData);
      console.log("======================================");

      await api.put(
        `/games/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Game Updated Successfully 🎮");

      // Go back to My Games
      navigate("/my-games");
    } catch (error) {
      console.error("UPDATE GAME ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update game"
      );
    } finally {
      setSaving(false);
    }
  };

  // ===============================
  // LOADING
  // ===============================
  if (loading) {
    return (
      <div className="edit-container">
        <div className="edit-card loading-card">
          <div className="edit-loading-icon">
            🎮
          </div>

          <h2>Loading Game...</h2>

          <p>
            Please wait while we load the game
            information.
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // ERROR
  // ===============================
  if (error) {
    return (
      <div className="edit-container">
        <div className="edit-card error-card">
          <div className="edit-error-icon">
            ⚠️
          </div>

          <h2>Unable to Load Game</h2>

          <p>{error}</p>

          <div className="edit-error-actions">
            <button
              type="button"
              onClick={fetchGame}
              className="retry-btn"
            >
              🔄 Try Again
            </button>

            <Link
              to="/my-games"
              className="cancel-btn"
            >
              ← Back to My Games
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="edit-container">

      <div className="edit-wrapper">

        {/* ===============================
            PAGE HEADER
        =============================== */}
        <div className="edit-header">

          <div>
            <div className="edit-badge">
              🎮 DEVELOPER PANEL
            </div>

            <h1>Edit Game</h1>

            <p>
              Update your game information and
              keep your listing up to date.
            </p>
          </div>

          <Link
            to="/my-games"
            className="back-to-games-btn"
          >
            ← My Games
          </Link>

        </div>

        {/* ===============================
            EDIT FORM CARD
        =============================== */}
        <div className="edit-card">

          <form onSubmit={handleSubmit}>

            {/* ===============================
                BASIC INFORMATION
            =============================== */}
            <div className="form-section">

              <div className="section-title">

                <span className="section-icon">
                  🎮
                </span>

                <div>
                  <h2>Basic Information</h2>

                  <p>
                    Main information displayed
                    about your game.
                  </p>
                </div>

              </div>

              {/* GAME TITLE */}
              <div className="form-group">

                <label htmlFor="title">
                  Game Title
                  <span>*</span>
                </label>

                <input
                  id="title"
                  type="text"
                  name="title"
                  placeholder="Enter game title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />

              </div>

              {/* DESCRIPTION */}
              <div className="form-group">

                <label htmlFor="description">
                  Description
                  <span>*</span>
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe your game..."
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />

                <small>
                  Give gamers a clear idea of
                  what your game is about.
                </small>

              </div>

              {/* GENRE + PLATFORM */}
              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="genre">
                    Genre
                    <span>*</span>
                  </label>

                  <input
                    id="genre"
                    type="text"
                    name="genre"
                    placeholder="Action, RPG, Adventure"
                    value={formData.genre}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    Multiple genres can be
                    separated by commas.
                  </small>

                </div>

                <div className="form-group">

                  <label htmlFor="platform">
                    Platform
                    <span>*</span>
                  </label>

                  <input
                    id="platform"
                    type="text"
                    name="platform"
                    placeholder="PC, Android, iOS"
                    value={formData.platform}
                    onChange={handleChange}
                    required
                  />

                </div>

              </div>

            </div>

            {/* ===============================
                STEAM INFORMATION
            =============================== */}
            <div className="form-section">

              <div className="section-title">

                <span className="section-icon">
                  🎯
                </span>

                <div>
                  <h2>Steam Information</h2>

                  <p>
                    Manage your Steam game
                    information.
                  </p>
                </div>

              </div>

              {/* STEAM APP ID */}
              <div className="form-group">

                <label htmlFor="steamAppId">
                  Steam App ID
                </label>

                <input
                  id="steamAppId"
                  type="text"
                  name="steamAppId"
                  placeholder="Example: 730"
                  value={formData.steamAppId}
                  onChange={handleChange}
                />

                <small>
                  Example: 730 for
                  Counter-Strike 2.
                </small>

              </div>

              {/* STEAM STORE LINK */}
              <div className="form-group">

                <label htmlFor="steamLink">
                  Steam Store URL
                </label>

                <input
                  id="steamLink"
                  type="url"
                  name="steamLink"
                  placeholder="https://store.steampowered.com/app/..."
                  value={formData.steamLink}
                  onChange={handleChange}
                />

              </div>
              {/* STEAM AFFILIATE LINK */}
<div className="form-group">

  <label htmlFor="steamAffiliateLink">
    Steam Affiliate Link
  </label>

  <input
    id="steamAffiliateLink"
    type="url"
    name="steamAffiliateLink"
    placeholder="Your Steam affiliate/tracking URL"
    value={formData.steamAffiliateLink}
    onChange={handleChange}
  />

  <small>
    Enter your approved Steam affiliate/tracking URL.
  </small>

</div>
              {/* EPIC GAMES STORE LINK */}
<div className="form-group">

  <label htmlFor="epicLink">
    Epic Games Store URL
  </label>

  <input
    id="epicLink"
    type="url"
    name="epicLink"
    placeholder="https://store.epicgames.com/..."
    value={formData.epicLink}
    onChange={handleChange}
  />

</div>
{/* EPIC AFFILIATE LINK */}
<div className="form-group">

  <label htmlFor="epicAffiliateLink">
    Epic Affiliate Link
  </label>

  <input
    id="epicAffiliateLink"
    type="url"
    name="epicAffiliateLink"
    placeholder="Your Epic affiliate/tracking URL"
    value={formData.epicAffiliateLink}
    onChange={handleChange}
  />

  <small>
    Enter your approved Epic affiliate/tracking URL.
  </small>

</div>

{/* ITCH.IO STORE LINK */}
<div className="form-group">

  <label htmlFor="itchLink">
    Itch.io Store URL
  </label>

  <input
    id="itchLink"
    type="url"
    name="itchLink"
    placeholder="https://yourgame.itch.io/your-game"
    value={formData.itchLink}
    onChange={handleChange}
  />

</div>
{/* ITCH.IO AFFILIATE LINK */}
<div className="form-group">

  <label htmlFor="itchAffiliateLink">
    Itch.io Affiliate Link
  </label>

  <input
    id="itchAffiliateLink"
    type="url"
    name="itchAffiliateLink"
    placeholder="Your Itch.io affiliate/tracking URL"
    value={formData.itchAffiliateLink}
    onChange={handleChange}
  />

  <small>
    Enter your approved Itch.io affiliate/tracking URL.
  </small>

</div>

            </div>

            {/* ===============================
                MEDIA
            =============================== */}
            <div className="form-section">

              <div className="section-title">

                <span className="section-icon">
                  🖼️
                </span>

                <div>
                  <h2>Game Media</h2>

                  <p>
                    Update your game's images
                    and trailer.
                  </p>
                </div>

              </div>

              {/* COVER IMAGE */}
              <div className="form-group">

                <label htmlFor="coverImage">
                  Cover Image URL
                </label>

                <input
                  id="coverImage"
                  type="url"
                  name="coverImage"
                  placeholder="https://example.com/game-cover.jpg"
                  value={formData.coverImage}
                  onChange={handleChange}
                />

              </div>

              {/* SCREENSHOTS */}
              <div className="form-group">

                <label htmlFor="screenshots">
                  Screenshots
                </label>

                <textarea
                  id="screenshots"
                  name="screenshots"
                  placeholder="Screenshot URL 1, Screenshot URL 2, Screenshot URL 3"
                  rows="4"
                  value={formData.screenshots}
                  onChange={handleChange}
                />

                <small>
                  Separate multiple screenshot
                  URLs with commas.
                </small>

              </div>

              {/* TRAILER */}
              <div className="form-group">

                <label htmlFor="trailer">
                  YouTube Trailer
                </label>

                <input
                  id="trailer"
                  type="url"
                  name="trailer"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.trailer}
                  onChange={handleChange}
                />

              </div>

            </div>

            {/* ===============================
                GAME DETAILS
            =============================== */}
            <div className="form-section">

              <div className="section-title">

                <span className="section-icon">
                  ⚙️
                </span>

                <div>
                  <h2>Game Details</h2>

                  <p>
                    Update pricing, release
                    date and tags.
                  </p>
                </div>

              </div>

              {/* PRICE + RELEASE DATE */}
              <div className="form-row">

                <div className="form-group">

                  <label htmlFor="price">
                    Price (₹)
                  </label>

                  <input
                    id="price"
                    type="number"
                    name="price"
                    min="0"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                  />

                  <small>
                    Enter 0 if the game is
                    free.
                  </small>

                </div>

                <div className="form-group">

                  <label htmlFor="releaseDate">
                    Release Date
                  </label>

                  <input
                    id="releaseDate"
                    type="date"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleChange}
                  />

                </div>

              </div>

              {/* TAGS */}
              <div className="form-group">

                <label htmlFor="tags">
                  Tags
                </label>

                <input
                  id="tags"
                  type="text"
                  name="tags"
                  placeholder="indie, action, multiplayer"
                  value={formData.tags}
                  onChange={handleChange}
                />

                <small>
                  Separate multiple tags with
                  commas.
                </small>

              </div>

            </div>

            {/* ===============================
                ACTIONS
            =============================== */}
            <div className="edit-actions">

              <Link
                to="/my-games"
                className="cancel-edit-btn"
              >
                ❌ Cancel
              </Link>

              <button
                type="submit"
                className="save-edit-btn"
                disabled={saving}
              >
                {saving ? (
                  <>
                    ⏳ Saving Changes...
                  </>
                ) : (
                  <>
                    💾 Save Changes
                  </>
                )}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default EditGame;
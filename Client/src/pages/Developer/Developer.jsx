import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./Developer.css";

function Developer() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    genre: "",
    platform: "",
    steamAppId: "",
    screenshots: "",
    trailer: "",
    price: "",
    steamLink: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const screenshotsArray = formData.screenshots
        .split(",")
        .map((url) => url.trim())
        .filter((url) => url !== "");

      const gameData = {
        title: formData.title,
        description: formData.description,
        genre: formData.genre,
        platform: formData.platform,

        // Steam App ID
        steamAppId: formData.steamAppId.trim(),

        screenshots: screenshotsArray,

        // YouTube trailer
        trailer: formData.trailer.trim(),

        // Manual price fallback
        price: Number(formData.price) || 0,

        // Steam store link
        storeLinks: {
          steam: formData.steamLink.trim(),
        },
      };

      console.log("========== GAME DATA ==========");
      console.log(gameData);
      console.log("===============================");

      await api.post("/games", gameData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Game Added Successfully");

      navigate("/games");
    } catch (error) {
      console.error("ADD GAME ERROR:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add game"
      );
    }
  };

  return (
    <div className="developer-container">
      <div className="developer-card">

        <h1>Add New Game</h1>

        <p className="developer-subtitle">
          Publish your indie game and showcase it to gamers.
        </p>

        <form onSubmit={handleSubmit}>

          {/* GAME TITLE */}
          <input
            type="text"
            name="title"
            placeholder="Game Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Game Description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          />

          {/* GENRE */}
          <input
            type="text"
            name="genre"
            placeholder="Genre (e.g. Action, RPG)"
            value={formData.genre}
            onChange={handleChange}
            required
          />

          {/* PLATFORM */}
          <input
            type="text"
            name="platform"
            placeholder="Platform (e.g. PC, Android)"
            value={formData.platform}
            onChange={handleChange}
            required
          />

          {/* STEAM APP ID */}
          <input
            type="text"
            name="steamAppId"
            placeholder="Steam App ID (e.g. 730)"
            value={formData.steamAppId}
            onChange={handleChange}
          />

          <small className="input-help">
            Example: 730 for Counter-Strike 2
          </small>

          {/* SCREENSHOTS */}
          <textarea
            name="screenshots"
            placeholder="Screenshot URLs separated by commas"
            rows="4"
            value={formData.screenshots}
            onChange={handleChange}
          />

          <small className="input-help">
            Example: https://image1.jpg, https://image2.jpg
          </small>

          {/* YOUTUBE TRAILER */}
          <input
            type="text"
            name="trailer"
            placeholder="YouTube Trailer URL"
            value={formData.trailer}
            onChange={handleChange}
          />

          <small className="input-help">
            Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
          </small>

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price (₹)"
            min="0"
            value={formData.price}
            onChange={handleChange}
          />

          <small className="input-help">
            Enter 0 if the game is free.
          </small>

          {/* STEAM STORE LINK */}
          <input
            type="text"
            name="steamLink"
            placeholder="Steam Store URL"
            value={formData.steamLink}
            onChange={handleChange}
          />

          <small className="input-help">
            Example: https://store.steampowered.com/app/730/
          </small>

          {/* SUBMIT */}
          <button type="submit">
            🎮 Publish Game
          </button>

        </form>

      </div>
    </div>
  );
}

export default Developer;
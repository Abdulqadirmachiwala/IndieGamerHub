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
  epicLink: "",
  itchLink: "",
  steamAffiliateLink: "",
epicAffiliateLink: "",
itchAffiliateLink: "",
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
        genre: formData.genre
  .split(",")
  .map((item) => item.trim())
  .filter((item) => item !== ""),
        platform: formData.platform,

        // Steam App ID
        steamAppId: formData.steamAppId.trim(),

        screenshots: screenshotsArray,

        // YouTube trailer
        trailer: formData.trailer.trim(),

        // Manual price fallback
        price: Number(formData.price) || 0,

       storeLinks: {
  steam: formData.steamLink.trim(),
  steamAffiliate: formData.steamAffiliateLink.trim(),

  epic: formData.epicLink.trim(),
  epicAffiliate: formData.epicAffiliateLink.trim(),

  itch: formData.itchLink.trim(),
  itchAffiliate: formData.itchAffiliateLink.trim(),
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
            placeholder="Genre (e.g. Action, RPG, Adventure)"
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
          <input
  type="text"
  name="steamAffiliateLink"
  placeholder="Steam Affiliate Link"
  value={formData.steamAffiliateLink}
  onChange={handleChange}
/>

<small className="input-help">
  Example: Your approved Steam affiliate/tracking URL
</small>

{/* EPIC GAMES STORE LINK */}
<input
  type="text"
  name="epicLink"
  placeholder="Epic Games Store URL"
  value={formData.epicLink}
  onChange={handleChange}
/>

<small className="input-help">
  Example: https://store.epicgames.com/...
</small>

{/* EPIC AFFILIATE LINK */}
<input
  type="text"
  name="epicAffiliateLink"
  placeholder="Epic Affiliate Link"
  value={formData.epicAffiliateLink}
  onChange={handleChange}
/>

<small className="input-help">
  Example: Your approved Epic affiliate/tracking URL
</small>
{/* STEAM AFFILIATE LINK */}




{/* ITCH.IO STORE LINK */}
<input
  type="text"
  name="itchLink"
  placeholder="Itch.io Store URL"
  value={formData.itchLink}
  onChange={handleChange}
/>

<small className="input-help">
  Example: https://yourgame.itch.io/your-game
</small>
{/* ITCH.IO AFFILIATE LINK */}
<input
  type="text"
  name="itchAffiliateLink"
  placeholder="Itch.io Affiliate Link"
  value={formData.itchAffiliateLink}
  onChange={handleChange}
/>

<small className="input-help">
  Example: Your approved Itch.io affiliate/tracking URL
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
import Game from "../models/Game.js";
import { getSteamGameDetails } from "../services/steamApi.js";

// ===============================
// ADD GAME
// ===============================
export const addGame = async (req, res) => {
  try {
    const {
      title,
      description,
      genre,
      platform,
      screenshots,
      trailer,
      price,
      steamAppId,
      storeLinks,
    } = req.body;

    let steamData = {};

    // Fetch Steam data if Steam App ID is provided
    if (steamAppId) {
      try {
        steamData = await getSteamGameDetails(steamAppId);
      } catch (error) {
        console.log("Steam data fetch failed:", error.message);
      }
    }

    const game = await Game.create({
      title: steamData.title || title,
      description: steamData.description || description,
      genre: steamData.genre || genre,
      platform,

      steamAppId: steamAppId || "",

      screenshots:
        steamData.screenshots?.length > 0
          ? steamData.screenshots
          : screenshots || [],

      trailer: trailer || "",

      price:
        steamData.price !== undefined
          ? steamData.price
          : Number(price) || 0,

      coverImage: steamData.coverImage || "",

      releaseDate: steamData.releaseDate || "",

      tags: steamData.tags || [],

      storeLinks: {
        steam:
          storeLinks?.steam ||
          (steamAppId
            ? `https://store.steampowered.com/app/${steamAppId}/`
            : ""),
      },

      // New games are NOT featured by default
      isFeatured: false,

      developer: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Game Added Successfully",
      game,
    });
  } catch (error) {
    console.error("Add Game Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL GAMES
// ===============================
export const getAllGames = async (req, res) => {
  try {
    const games = await Game.find()
      .populate("developer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET SINGLE GAME
// ===============================
export const getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id).populate(
      "developer",
      "name email"
    );

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    res.status(200).json({
      success: true,
      game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE GAME
// ===============================
export const updateGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // ===============================
    // CHECK GAME OWNERSHIP
    // ===============================
    if (game.developer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this game",
      });
    }

    // ===============================
    // UPDATE BASIC DETAILS
    // ===============================
    game.title = req.body.title || game.title;
    game.description =
      req.body.description || game.description;
    game.genre = req.body.genre || game.genre;
    game.platform =
      req.body.platform || game.platform;

    // ===============================
    // UPDATE STEAM APP ID
    // ===============================
    if (req.body.steamAppId !== undefined) {
      game.steamAppId = req.body.steamAppId;
    }

    // ===============================
    // UPDATE COVER IMAGE
    // ===============================
    if (req.body.coverImage !== undefined) {
      game.coverImage = req.body.coverImage;
    }

    // ===============================
    // UPDATE SCREENSHOTS
    // ===============================
    if (req.body.screenshots !== undefined) {
      game.screenshots = req.body.screenshots;
    }

    // ===============================
    // UPDATE TRAILER
    // ===============================
    if (req.body.trailer !== undefined) {
      game.trailer = req.body.trailer;
    }

    // ===============================
    // UPDATE PRICE
    // ===============================
    if (req.body.price !== undefined) {
      game.price = Number(req.body.price) || 0;
    }

    // ===============================
    // UPDATE RELEASE DATE
    // ===============================
    if (req.body.releaseDate !== undefined) {
      game.releaseDate = req.body.releaseDate;
    }

    // ===============================
    // UPDATE TAGS
    // ===============================
    if (req.body.tags !== undefined) {
      game.tags = req.body.tags;
    }

    // ===============================
    // UPDATE STORE LINKS
    // ===============================
    if (req.body.storeLinks !== undefined) {
      game.storeLinks = {
        steam: req.body.storeLinks.steam || "",
      };
    }

    const updatedGame = await game.save();

    res.status(200).json({
      success: true,
      message: "Game Updated Successfully",
      game: updatedGame,
    });
  } catch (error) {
    console.error("Update Game Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE GAME
// ===============================
// ===============================
// DELETE GAME
// ===============================
export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // ===============================
    // CHECK GAME OWNERSHIP
    // ===============================
    if (game.developer.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this game",
      });
    }

    await game.deleteOne();

    res.status(200).json({
      success: true,
      message: "Game Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Game Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET MY GAMES
// ===============================
export const getMyGames = async (req, res) => {
  try {
    const games = await Game.find({
      developer: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// FEATURE / UNFEATURE GAME
// ===============================
export const toggleFeaturedGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    game.isFeatured = !game.isFeatured;

    await game.save();

    res.status(200).json({
      success: true,
      message: game.isFeatured
        ? "Game Featured Successfully"
        : "Game Removed From Featured",
      game,
    });
  } catch (error) {
    console.error("Toggle Featured Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET FEATURED GAMES
// ===============================
export const getFeaturedGames = async (req, res) => {
  try {
    const games = await Game.find({
      isFeatured: true,
    })
      .populate("developer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: games.length,
      games,
    });
  } catch (error) {
    console.error("Get Featured Games Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
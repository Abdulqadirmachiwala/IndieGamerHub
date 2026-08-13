import express from "express";

import {
  addGame,
  getAllGames,
  getGameById,
  updateGame,
  deleteGame,
  getMyGames,
  toggleFeaturedGame,
  getFeaturedGames,
} from "../controllers/gameControllers.js";

import protect from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// ===============================
// ADD GAME
// ===============================
router.post("/", protect, addGame);

// ===============================
// GET FEATURED GAMES
// Public
// ===============================
router.get("/featured", getFeaturedGames);

// ===============================
// GET MY GAMES
// Protected
// ===============================
router.get("/my-games", protect, getMyGames);

// ===============================
// GET ALL GAMES
// Public
// ===============================
router.get("/", getAllGames);

// ===============================
// GET SINGLE GAME
// Public
// ===============================
router.get("/:id", getGameById);

// ===============================
// UPDATE GAME
// Protected
// ===============================
router.put("/:id", protect, updateGame);

// ===============================
// FEATURE / UNFEATURE GAME
// Protected
// ===============================
router.put(
  "/:id/featured",
  protect,
  adminMiddleware,
  toggleFeaturedGame
);

// ===============================
// DELETE GAME
// Protected
// ===============================
router.delete("/:id", protect, deleteGame);

export default router;
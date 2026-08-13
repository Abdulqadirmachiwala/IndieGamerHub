import express from "express";

import {
  addReview,
  getGameReviews,
  getAllReviews,
  updateReview,
  deleteReview,
  getTrendingGames,
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Get All Reviews
router.get("/", getAllReviews);

// Trending Games
router.get("/trending", getTrendingGames);

// Add Review
router.post("/:gameId", protect, addReview);

// Get Reviews of Particular Game
router.get("/:gameId", getGameReviews);

// Update Review
router.put("/:id", protect, updateReview);

// Delete Review
router.delete("/:id", protect, deleteReview);

export default router;
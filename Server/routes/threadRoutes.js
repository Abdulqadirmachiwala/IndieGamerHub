import express from "express";

import {
  createThread,
  getGameThreads,
  getThreadById,
  deleteThread,
} from "../controllers/threadController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// CREATE THREAD
// POST /api/threads/:gameId
// Protected
// =====================================
router.post("/:gameId", protect, createThread);

// =====================================
// GET ALL THREADS OF A GAME
// GET /api/threads/game/:gameId
// Public
// =====================================
router.get("/game/:gameId", getGameThreads);

// =====================================
// GET SINGLE THREAD + POSTS
// GET /api/threads/:id
// Public
// =====================================
router.get("/:id", getThreadById);

// =====================================
// DELETE OWN THREAD
// DELETE /api/threads/:id
// Protected
// =====================================
router.delete("/:id", protect, deleteThread);

export default router;
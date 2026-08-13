import express from "express";

import {
  createPost,
  getThreadPosts,
  updatePost,
  deletePost,
} from "../controllers/postController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// CREATE REPLY
// POST /api/posts/:threadId
// Protected
// =====================================
router.post("/:threadId", protect, createPost);

// =====================================
// GET THREAD POSTS
// GET /api/posts/:threadId
// Public
// =====================================
router.get("/:threadId", getThreadPosts);

// =====================================
// UPDATE OWN POST
// PUT /api/posts/:id
// Protected
// =====================================
router.put("/:id", protect, updatePost);

// =====================================
// DELETE OWN POST
// DELETE /api/posts/:id
// Protected
// =====================================
router.delete("/:id", protect, deletePost);

export default router;
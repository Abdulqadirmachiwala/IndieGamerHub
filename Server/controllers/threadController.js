import Thread from "../models/Thread.js";
import Post from "../models/Post.js";

// =====================================
// CREATE THREAD
// POST /api/threads/:gameId
// Protected
// =====================================
export const createThread = async (req, res) => {
  try {
    const { title } = req.body;
    const { gameId } = req.params;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Thread title is required",
      });
    }

    const thread = await Thread.create({
      title: title.trim(),
      game: gameId,
      author: req.user.id,
    });

    const populatedThread = await Thread.findById(thread._id)
      .populate("author", "name email")
      .populate("game", "title");

    res.status(201).json({
      success: true,
      message: "Thread Created Successfully",
      thread: populatedThread,
    });
  } catch (error) {
    console.error("Create Thread Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET THREADS FOR A GAME
// GET /api/threads/game/:gameId
// Public
// =====================================
export const getGameThreads = async (req, res) => {
  try {
    const { gameId } = req.params;

    const threads = await Thread.find({
      game: gameId,
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: threads.length,
      threads,
    });
  } catch (error) {
    console.error("Get Game Threads Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET SINGLE THREAD
// GET /api/threads/:id
// Public
// =====================================
export const getThreadById = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate("author", "name email")
      .populate("game", "title");

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const posts = await Post.find({
      thread: thread._id,
    })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      thread,
      posts,
    });
  } catch (error) {
    console.error("Get Thread Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// DELETE THREAD
// DELETE /api/threads/:id
// Protected
// =====================================
export const deleteThread = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    // Only thread owner can delete it
    if (thread.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own thread",
      });
    }

    // Delete all posts belonging to this thread
    await Post.deleteMany({
      thread: thread._id,
    });

    await thread.deleteOne();

    res.status(200).json({
      success: true,
      message: "Thread Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Thread Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
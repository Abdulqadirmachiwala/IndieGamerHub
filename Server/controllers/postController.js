import Post from "../models/Post.js";
import Thread from "../models/Thread.js";

// =====================================
// CREATE POST / REPLY
// POST /api/posts/:threadId
// Protected
// =====================================
export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const { threadId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    // Check if thread exists
    const thread = await Thread.findById(threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const post = await Post.create({
      content: content.trim(),
      thread: threadId,
      author: req.user.id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Reply Added Successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Create Post Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// GET POSTS OF THREAD
// GET /api/posts/:threadId
// Public
// =====================================
export const getThreadPosts = async (req, res) => {
  try {
    const { threadId } = req.params;

    // Check if thread exists
    const thread = await Thread.findById(threadId);

    if (!thread) {
      return res.status(404).json({
        success: false,
        message: "Thread not found",
      });
    }

    const posts = await Post.find({
      thread: threadId,
    })
      .populate("author", "name email")
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get Thread Posts Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// UPDATE POST
// PUT /api/posts/:id
// Protected
// =====================================
export const updatePost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Post content is required",
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only post owner can edit
    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own post",
      });
    }

    post.content = content.trim();

    const updatedPost = await post.save();

    const populatedPost = await Post.findById(updatedPost._id).populate(
      "author",
      "name email"
    );

    res.status(200).json({
      success: true,
      message: "Post Updated Successfully",
      post: populatedPost,
    });
  } catch (error) {
    console.error("Update Post Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// DELETE POST
// DELETE /api/posts/:id
// Protected
// =====================================
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Only post owner can delete
    if (post.author.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own post",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Post Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
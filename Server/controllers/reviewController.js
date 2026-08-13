import Review from "../models/Review.js";
import Game from "../models/Game.js";

// ===============================
// UPDATE GAME RATING CACHE
// ===============================
const updateGameRating = async (gameId) => {
  const result = await Review.aggregate([
    {
      $match: {
        game: gameId,
      },
    },
    {
      $group: {
        _id: "$game",
        averageRating: {
          $avg: "$rating",
        },
        reviewCount: {
          $sum: 1,
        },
      },
    },
  ]);

  if (result.length === 0) {
    await Game.findByIdAndUpdate(gameId, {
      averageRating: 0,
      reviewCount: 0,
    });

    return;
  }

  await Game.findByIdAndUpdate(gameId, {
    averageRating: Number(result[0].averageRating.toFixed(1)),
    reviewCount: result[0].reviewCount,
  });
};

// ===============================
// ADD REVIEW
// ===============================
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // Validate rating
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Validate comment
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    // Check if game exists
    const game = await Game.findById(req.params.gameId);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    // Check if user already reviewed this game
    const alreadyReviewed = await Review.findOne({
      user: req.user.id,
      game: req.params.gameId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this game",
      });
    }

    // Create review
    const review = await Review.create({
      rating: Number(rating),
      comment: comment.trim(),
      user: req.user.id,
      game: req.params.gameId,
    });

    // Update rating cache
    await updateGameRating(req.params.gameId);

    res.status(201).json({
      success: true,
      message: "Review Added Successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET GAME REVIEWS
// ===============================
export const getGameReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      game: req.params.gameId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get Game Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET ALL REVIEWS
// ===============================
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name")
      .populate("game", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// UPDATE REVIEW
// ===============================
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only review owner can edit
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this review",
      });
    }

    // Update rating
    if (rating !== undefined) {
      if (Number(rating) < 1 || Number(rating) > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = Number(rating);
    }

    // Update comment
    if (comment !== undefined) {
      if (!comment.trim()) {
        return res.status(400).json({
          success: false,
          message: "Comment cannot be empty",
        });
      }

      review.comment = comment.trim();
    }

    const updatedReview = await review.save();

    // Update rating cache
    await updateGameRating(review.game);

    res.status(200).json({
      success: true,
      message: "Review Updated Successfully",
      review: updatedReview,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// DELETE REVIEW
// ===============================
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    // Only review owner can delete
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this review",
      });
    }

    const gameId = review.game;

    await review.deleteOne();

    // Update rating cache after deletion
    await updateGameRating(gameId);

    res.status(200).json({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===============================
// GET TRENDING GAMES
// ===============================
export const getTrendingGames = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 7
    );

    const trendingGames = await Review.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgo,
          },
        },
      },

      {
        $group: {
          _id: "$game",
          reviewCount: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          reviewCount: -1,
        },
      },

      {
        $limit: 6,
      },
    ]);

    const gameIds = trendingGames.map(
      (item) => item._id
    );

    const games = await Game.find({
      _id: {
        $in: gameIds,
      },
    });

    const result = games.map((game) => {
      const trending = trendingGames.find(
        (item) =>
          item._id.toString() ===
          game._id.toString()
      );

      return {
        ...game.toObject(),

        reviewCount:
          trending?.reviewCount || 0,
      };
    });

    // Preserve trending order
    result.sort((a, b) => {
      const aCount =
        trendingGames.find(
          (item) =>
            item._id.toString() ===
            a._id.toString()
        )?.reviewCount || 0;

      const bCount =
        trendingGames.find(
          (item) =>
            item._id.toString() ===
            b._id.toString()
        )?.reviewCount || 0;

      return bCount - aCount;
    });

    res.status(200).json({
      success: true,
      count: result.length,
      games: result,
    });
  } catch (error) {
    console.error(
      "Get Trending Games Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
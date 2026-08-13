import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    platform: {
      type: String,
      required: true,
    },

    // Steam App ID
    steamAppId: {
      type: String,
      default: "",
    },

    // Game cover/header image
    coverImage: {
      type: String,
      default: "",
    },

    // Game screenshots
    screenshots: {
      type: [String],
      default: [],
    },

    // YouTube trailer
    trailer: {
      type: String,
      default: "",
    },

    // Game price
    price: {
      type: Number,
      default: 0,
    },

    // Release date from Steam
    releaseDate: {
      type: String,
      default: "",
    },

    // Steam tags
    tags: {
      type: [String],
      default: [],
    },

    // External store links
    storeLinks: {
      steam: {
        type: String,
        default: "",
      },
    },

    // Featured Game
    isFeatured: {
      type: Boolean,
      default: false,
    },
    // Cached review statistics
averageRating: {
  type: Number,
  default: 0,
},

reviewCount: {
  type: Number,
  default: 0,
},

    // Developer who added the game
    developer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Game", gameSchema);
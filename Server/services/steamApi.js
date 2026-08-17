import axios from "axios";

export const getSteamGameDetails = async (appId) => {
  try {
    if (!appId) {
      throw new Error("Steam App ID is required");
    }

    const response = await axios.get(
      `https://store.steampowered.com/api/appdetails?appids=${appId}&l=english`
    );

    const result = response.data?.[appId];

    if (!result || !result.success) {
      throw new Error("Steam game not found");
    }

    const game = result.data;

    return {
      title: game.name || "",
      description: game.short_description || "",

      // Genre as Array
      genre:
  game.genres?.map((item) => item.description) || [],
        

      releaseDate: game.release_date?.date || "",

      price:
        game.is_free || !game.price_overview
          ? 0
          : game.price_overview.final / 100,

      tags:
        game.categories?.map((item) => item.description) || [],

      coverImage: game.header_image || "",

      screenshots:
        game.screenshots?.map((item) => item.path_full) || [],
    };
  } catch (error) {
    console.error(
      "Steam API Error:",
      error.response?.data || error.message
    );

    throw new Error("Failed to fetch game details from Steam");
  }
};
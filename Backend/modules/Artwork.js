const mongoose = require("mongoose");

/**
 * Artwork Schema
 * Minimal fields required for MVP + a few useful extras for filtering.
 */
const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true }, // e.g. "/uploads/1692700000000-painting.jpg"
    artForm: {
      type: String,
      enum: [
        "Warli",
        "Pithora",
        "Madhubani",
        "Gond",
        "Kalamkari",
        "Bhil",
        "Pattachitra",
        "Other",
      ],
      default: "Other",
    },
    state: { type: String, trim: true }, // e.g. "Bihar", "Maharashtra"
    tags: [{ type: String, trim: true }],

    // Relations
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Optional commerce-ish fields (you can ignore on frontend if not needed yet)
    isForSale: { type: Boolean, default: false },
    price: { type: Number, min: 0 },

    // Engagement
    likesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Helpful for simple search
artworkSchema.index({ title: "text", description: "text", tags: 1 });

module.exports = mongoose.model("Artwork", artworkSchema);

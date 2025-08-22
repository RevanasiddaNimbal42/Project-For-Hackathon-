const fs = require("fs");
const path = require("path");
const Artwork = require("../modules/Artwork");

/**
 * Utility to safely delete an old image file if we replaced it
 */
const safeUnlink = (absPath) => {
  try {
    if (absPath && fs.existsSync(absPath)) fs.unlinkSync(absPath);
  } catch (_) {
    // swallow file deletion errors — not critical
  }
};

/**
 * @desc    Create/Upload new artwork
 * @route   POST /api/artworks
 * @access  Private (artist must be logged in)
 * Expects: multipart/form-data with fields:
 *         - image (file)
 *         - title (string, required)
 *         - description (string, optional)
 *         - artForm, state, tags (optional)
 */
exports.createArtwork = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }
    const { title, description, artForm, state, tags } = req.body;

    const artwork = await Artwork.create({
      title,
      description,
      artForm,
      state,
      tags: tags ? String(tags).split(",").map((t) => t.trim()).filter(Boolean) : [],
      imageUrl: `/uploads/${req.file.filename}`,
      artist: req.user._id,
    });

    const populated = await artwork.populate("artist", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to create artwork" });
  }
};

/**
 * @desc    Get paginated artworks with optional filters
 * @route   GET /api/artworks
 * @access  Public
 * Query:   page=1&limit=12&q=keyword&artForm=Warli&state=Bihar&artist=<id>&sort=latest|popular
 */
exports.getArtworks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 48);
    const skip = (page - 1) * limit;

    const { q, artForm, state, artist, sort } = req.query;

    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { tags: { $elemMatch: { $regex: q, $options: "i" } } },
      ];
    }
    if (artForm) filter.artForm = artForm;
    if (state) filter.state = state;
    if (artist) filter.artist = artist;

    let sortSpec = { createdAt: -1 }; // latest
    if (sort === "popular") sortSpec = { likesCount: -1, views: -1, createdAt: -1 };

    const [total, items] = await Promise.all([
      Artwork.countDocuments(filter),
      Artwork.find(filter)
        .populate("artist", "name email")
        .sort(sortSpec)
        .skip(skip)
        .limit(limit),
    ]);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      items,
    });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch artworks" });
  }
};

/**
 * @desc    Get one artwork (and increment views)
 * @route   GET /api/artworks/:id
 * @access  Public
 */
exports.getArtworkById = async (req, res) => {
  try {
    const art = await Artwork.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("artist", "name email");
    if (!art) return res.status(404).json({ message: "Artwork not found" });
    res.json(art);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch artwork" });
  }
};

/**
 * @desc    Update an artwork (only owner)
 * @route   PATCH /api/artworks/:id
 * @access  Private
 * Accepts multipart/form-data (may include new image)
 */
exports.updateArtwork = async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });

    // ownership check
    if (String(art.artist) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to edit this artwork" });
    }

    const updatableFields = ["title", "description", "artForm", "state", "isForSale", "price"];
    updatableFields.forEach((f) => {
      if (req.body[f] !== undefined) art[f] = req.body[f];
    });

    if (req.body.tags !== undefined) {
      art.tags = String(req.body.tags).split(",").map((t) => t.trim()).filter(Boolean);
    }

    // If a new image is uploaded, replace and delete old file
    if (req.file) {
      const oldPath = path.join(__dirname, "..", art.imageUrl);
      art.imageUrl = `/uploads/${req.file.filename}`;
      safeUnlink(oldPath);
    }

    await art.save();
    const populated = await art.populate("artist", "name email");
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to update artwork" });
  }
};

/**
 * @desc    Delete an artwork (only owner)
 * @route   DELETE /api/artworks/:id
 * @access  Private
 */
exports.deleteArtwork = async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });

    if (String(art.artist) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this artwork" });
    }

    const absolute = path.join(__dirname, "..", art.imageUrl);
    await art.deleteOne();
    safeUnlink(absolute);

    res.json({ message: "Artwork deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to delete artwork" });
  }
};

/**
 * @desc    Get logged-in artist's own artworks
 * @route   GET /api/artworks/me
 * @access  Private
 */
exports.getMyArtworks = async (req, res) => {
  try {
    const items = await Artwork.find({ artist: req.user._id })
      .sort({ createdAt: -1 })
      .populate("artist", "name email");
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch your artworks" });
  }
};

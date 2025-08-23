const fs = require("fs");
const path = require("path");
const Artwork = require("../modules/Artwork");

const safeUnlink = (absPath) => {
  try {
    if (absPath && fs.existsSync(absPath)) fs.unlinkSync(absPath);
  } catch (error) {
    console.log(error);
  }
};

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
      tags: tags
        ? String(tags)
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [],
      imageUrl: `/uploads/${req.file.filename}`,
      artist: req.user._id,
    });

    const populated = await artwork.populate("artist", "name email");
    res.status(201).json(populated);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to create artwork" });
  }
};

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

    let sortSpec = { createdAt: -1 };
    if (sort === "popular")
      sortSpec = { likesCount: -1, views: -1, createdAt: -1 };

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
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch artworks" });
  }
};

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

exports.updateArtwork = async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });

    if (String(art.artist) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this artwork" });
    }

    const updatableFields = [
      "title",
      "description",
      "artForm",
      "state",
      "isForSale",
      "price",
    ];
    updatableFields.forEach((f) => {
      if (req.body[f] !== undefined) art[f] = req.body[f];
    });

    if (req.body.tags !== undefined) {
      art.tags = String(req.body.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (req.file) {
      const oldPath = path.join(__dirname, "..", art.imageUrl);
      art.imageUrl = `/uploads/${req.file.filename}`;
      safeUnlink(oldPath);
    }

    await art.save();
    const populated = await art.populate("artist", "name email");
    res.json(populated);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to update artwork" });
  }
};

exports.deleteArtwork = async (req, res) => {
  try {
    const art = await Artwork.findById(req.params.id);
    if (!art) return res.status(404).json({ message: "Artwork not found" });

    if (String(art.artist) !== String(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this artwork" });
    }

    const absolute = path.join(__dirname, "..", art.imageUrl);
    await art.deleteOne();
    safeUnlink(absolute);

    res.json({ message: "Artwork deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to delete artwork" });
  }
};

exports.getMyArtworks = async (req, res) => {
  try {
    const items = await Artwork.find({ artist: req.user._id })
      .sort({ createdAt: -1 })
      .populate("artist", "name email");
    res.json(items);
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Failed to fetch your artworks" });
  }
};

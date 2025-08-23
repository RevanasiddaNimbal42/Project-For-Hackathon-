const Comment = require("../modules/Comment");
const Artwork = require("../modules/Artwork");

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { artworkId } = req.params;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const artwork = await Artwork.findById(artworkId);
    if (!artwork) {
      return res.status(404).json({ message: "Artwork not found" });
    }

    const comment = await Comment.create({
      text,
      user: req.user._id,
      artwork: artworkId,
    });

    res.status(201).json(comment);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: err.message });
  }
};

exports.getCommentsByArtwork = async (req, res) => {
  try {
    const { artworkId } = req.params;

    const comments = await Comment.find({ artwork: artworkId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching comments", error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this comment" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting comment", error: err.message });
  }
};

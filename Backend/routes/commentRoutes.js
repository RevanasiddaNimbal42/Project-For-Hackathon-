const express = require("express");
const router = express.Router();
const { addComment, getCommentsByArtwork, deleteComment } = require("../controllers/commentController");
const { protect } = require("../middlewares/authmiddleware");

// Add a comment to artwork (protected)
router.post("/:artworkId", protect, addComment);

// Get comments for an artwork
router.get("/:artworkId", getCommentsByArtwork);

// Delete a comment (only owner)
router.delete("/:commentId", protect, deleteComment);

module.exports = router;

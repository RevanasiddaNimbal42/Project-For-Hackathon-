const express = require("express");
const multer = require("multer");
const path = require("path");
const { protect } = require("../middlewares/authmiddleware");
const {
  createArtwork,
  getArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork,
  getMyArtworks,
} = require("../controllers/artworkController");

const router = express.Router();

/**
 * Multer configuration
 * - Stores files in /backend/uploads
 * - Accepts only images
 * - Limits size to ~5MB
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, Date.now() + "-" + safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith("image/")) cb(null, true);
  else cb(new Error("Only image files are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/**
 * ROUTES
 */
router.get("/", getArtworks);
router.get("/me", protect, getMyArtworks);
router.get("/:id", getArtworkById);

router.post("/", protect, upload.single("image"), createArtwork);
router.patch("/:id", protect, upload.single("image"), updateArtwork);
router.delete("/:id", protect, deleteArtwork);

module.exports = router;

const User = require("../modules/user");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password"); // remove password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email, bio, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.profileImage = profileImage || user.profileImage;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

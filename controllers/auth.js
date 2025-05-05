const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    //! --- CHECK EXISTING USER WITH SAME EMAIL ---
    const isEmailExist = await User.findOne({ email });

    if (isEmailExist) {
      return res.status(400).json({
        success: false,
        message: "There is already a user with this email ",
      });
    }
    //! -------------------------------------------

    //! --- CHECK IF IS CONFIRMATION PASSWORD OK ---
    const isPasswordConfirmed = password === confirmPassword;

    if (!isPasswordConfirmed) {
      return res.status(400).json({
        success: false,
        message: "Confirmation Password is not correct !",
      });
    }
    //! --------------------------------------------

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "student",
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "You signed up successfully !",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unexpected error occured. Please try again...",
    });
  }
};

const login = async (req, res) => {
  const { email, password, lastLoginDate } = req.body;
  console.log(req);

  const user = await User.findOne({ email });

  //! --- CHECK IF THERE IS A USER WITH THIS EMAIL ---
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "There is not a user with this email !",
    });
  }
  //! ------------------------------------------------

  //! --- CHECK IF PASSWORD IS CORRECT ---
  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    return res.status(404).json({
      success: false,
      message: "Invalid Password !",
    });
  }
  //! ------------------------------------

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLoginDate: lastLoginDate,
      ip: req.headers["x-forwarded-for"] || req.connection.remoteAddress,
      image: user.image,
    },
    JWT_SECRET
  );

  return res.status(201).json({
    success: true,
    message: "Logged in Successfully 😊",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLoginDate: lastLoginDate,
    },
  });
};

const getUserInfo = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized action !",
    });
  }

  const { userId } = req.params;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "An error occured while getUserInfo !",
      });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected network error while getUserInfo !",
    });
  }
};

const addProfilePicture = async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized action !",
    });
  }

  const token = authHeader.split(" ")[1];
  const { id } = jwt.verify(token, JWT_SECRET);
  const image = req.body;

  try {
    const UpdatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { image } },
      { new: true, runValidators: true }
    );
    if (!UpdatedUser) {
      return res.status(404).json({
        success: false,
        message: "An error occured while updating profile picture !",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfullu ...",
      user: UpdatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected error while updating profile picture !",
    });
  }
};

module.exports = { signup, login, getUserInfo, addProfilePicture };

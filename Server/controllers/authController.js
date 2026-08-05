import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register User
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check all fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: generateToken(user._id, user.role),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    console.log("Register API Hit");
console.log(req.body);
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });

    // Check email & password
    if (user && (await user.matchPassword(password))) {
      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: generateToken(user._id, user.role),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage,
        },
      });
    }

    res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
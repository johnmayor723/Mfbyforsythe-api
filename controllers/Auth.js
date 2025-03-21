const User = require('../models/User');
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');

const jwtSecret = "%^^__64sffyyyuuyrrrewe32e";

// User Registration
exports.register = async (req, res) => {
  try {
      
      console.log("here now")
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });

    user.verificationToken = crypto.randomBytes(32).toString("hex");
    await user.save();

    const verificationUrl = `http://93.127.160.233:3060/api/auth/verify-email/${user.verificationToken}`;
    console.log("sending mail")
    await sendEmail(user.email, "Verify Your Email", `Click here to verify: ${verificationUrl}`);

    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "1h" });

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt
    };

    res.json({
      message: "Registration successful. Check your email for verification link.",
      token,
      user: userResponse
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Send Email Function
const sendEmail = async (to, subject, text) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "support@marketspick.com",
      pass: "#@T1onal_Mayor",
    },
  });

  await transporter.sendMail({
    from: `"Market Picks" <support@marketspick.com>`,
    to,
    subject,
    text,
  });
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '1h' });
  res.json({ token });
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).json({ error: "Invalid or expired token" });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.redirect("https://mfbyforesythebrand.com/verified-email-login");
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Request Password Reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordExpires = Date.now() + 3600000; 

    await user.save();

    const resetUrl = `http://93.127.160.233:3060/api/auth/reset-password/${user.resetPasswordToken}`;
    sendEmail(user.email, "Password Reset", `Click here to reset your password: ${resetUrl}`);

    res.json({ message: "Password reset link sent to email." });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } });

    if (!user) {
      return res.redirect("http://93.127.160.233:3060/api/auth/error-password-reset");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

     res.redirect("https://mfbyforesythebrand.com/success-password-reset-login");
  } catch (error) {
    res.redirect("http://93.127.160.233:3060/api/auth/error-password-reset");
  }
};

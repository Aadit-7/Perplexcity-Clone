import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.services.js";

export async function register(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({
    $or: [{ email }, { password }],
  });

  if (isUserAlreadyExists) {
    return res.status(400).json({
      message: "User with this email already exists. Try different !!!",
      success: false,
      err: "User alredy Exists",
    });
  }

  const user = await userModel.create({ username, email, password });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
  );

  await sendEmail({
    to: email,
    subject: "Welcome to Perplexcity Clone",
    html: `
    <p>Hi ${username}</p>
    <p> Thank for registering at <strong>Perplexcity Clone</strong>. We're excited to have on board!</p>
    <p>Please verify your email by clicking the link given below:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">VERIFY EMAIL</a>
    <p>If you don't want to create the account then please ignore this email.</p>
    <p>Best regards,<br>Team Perplexcity Colne</p>
    `,
  });

  res.status(201).json({
    message: "User registered Successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "Invalid email ",
      success: false,
      err: "Incorrect Email",
    });
  }

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Invalid password ",
      success: false,
      err: "Incorrect password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "Please verify your email before login ",
      success: false,
      err: "Email not verified",
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in Successfullu",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMe(req, res) {
  const userId = req.user.id;

  const user = await userModel.findOne({ _id: userId }).select("-password");
  console.log(user);
  if (!userId) {
    return res.status(400).json({
      message: "User not found ",
      success: false,
      err: "User not found",
    });
  }

  res.status(200).json({
    message: "User fetched successfully",
    success: true,
    user,
  });
}

export async function verifyEmail(req, res) {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Token",
        success: false,
        err: "User not found",
      });
    }

    // user.verified = true;

    // await user.save();

    const html = `
  <h1>Email verififed Successfully</h1>
  <p>Your email has been verified. You can now log in to your account</p>
  <a href="http://localhost:3000/api/auth/login">Go to login</a>
  `;

    const alreadyVerified = `
  <h1>Email already verififed </h1>
  <p>Your email has been already verified. You can now log in to your account</p>
  <a href="http://localhost:3000/api/auth/login">Go to login</a>
  `;

    if (user.verified) {
      return res.send(alreadyVerified);
    }

    user.verified = true;
    await user.save();

    return res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "Invalid Token",
      success: false,
      err: "User not found",
    });
  }
}

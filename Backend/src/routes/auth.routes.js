import { Router } from "express";
import {
  loginValidator,
  registerValidator,
} from "../validators/auth.validator.js";
import {
  getMe,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const authRouter = Router();

/**
 * @route POST api/aut/register
 * @desc Register a new user
 * @access Public
 * @body {username, email, password}
 */
authRouter.post("/register", registerValidator, register);

/**
 * @route POST api/aut/login
 * @desc Login a user
 * @access Public
 * @body {email, password}
 */
authRouter.post("/login", loginValidator, login);

/**
 * @route GET api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 */
authRouter.get("/get-me", authUser, getMe);

/**
 * @route GET api/auth/verify-email
 * @desc Verify user's email using token
 * @access Public
 * @query {token}
 */
authRouter.get("/verify-email", verifyEmail);

export default authRouter;

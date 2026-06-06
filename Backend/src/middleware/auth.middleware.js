import jwt from "jsonwebtoken";

export function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Unauthorized ",
      success: false,
      err: "Token not provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = decoded;
    console.log(decoded);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Unauthorized ",
      success: false,
      err: "Invalid token",
    });
  }
}

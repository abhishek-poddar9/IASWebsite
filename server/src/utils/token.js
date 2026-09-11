import jwt from "jsonwebtoken";

/* =========================================================
   CREATE JWT TOKEN
========================================================= */

export const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing in .env"
    );
  }

  if (!user?._id) {
    throw new Error(
      "User ID is required to create token"
    );
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/* =========================================================
   VERIFY JWT TOKEN
========================================================= */

export const verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    throw new Error(
      "JWT_SECRET is missing in .env"
    );
  }

  return jwt.verify(
    token,
    process.env.JWT_SECRET
  );
};
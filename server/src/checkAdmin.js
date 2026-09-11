import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const checkAdmin = async () => {
  try {
    await connectDB();

    const email = String(
      process.env.ADMIN_EMAIL || ""
    )
      .trim()
      .toLowerCase();

    const password =
      process.env.ADMIN_PASSWORD || "";

    console.log("");
    console.log("Checking admin...");
    console.log("Email:", email);

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      console.log("");
      console.log("❌ USER NOT FOUND IN MONGODB");
      console.log(
        "Run: npm run setup-admin"
      );

      process.exit(1);
    }

    console.log("");
    console.log("✅ USER FOUND");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("Role:", user.role);
    console.log(
      "Active:",
      user.active !== false
    );

    if (!user.password) {
      console.log("");
      console.log(
        "❌ Password field missing in MongoDB"
      );

      process.exit(1);
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log("");
    console.log(
      "Password matches .env:",
      passwordMatches
    );

    if (!passwordMatches) {
      console.log("");
      console.log(
        "❌ DATABASE PASSWORD DOES NOT MATCH ADMIN_PASSWORD"
      );

      console.log(
        "Run: npm run setup-admin"
      );

      process.exit(1);
    }

    if (user.role !== "admin") {
      console.log("");
      console.log(
        "❌ User exists but role is not admin"
      );

      process.exit(1);
    }

    console.log("");
    console.log(
      "✅ ADMIN ACCOUNT IS CORRECT"
    );

    console.log(
      "You should now be able to login."
    );

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error(
      "CHECK ADMIN ERROR:",
      error
    );

    process.exit(1);
  }
};

checkAdmin();
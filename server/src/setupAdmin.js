import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

import { connectDB } from "./config/db.js";
import User from "./models/User.js";

const setupAdmin = async () => {
  try {
    await connectDB();

    const email = String(process.env.ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();

    const password = process.env.ADMIN_PASSWORD;

    const name = process.env.ADMIN_NAME || "Intime Admin";

    if (!email) {
      throw new Error("ADMIN_EMAIL missing in .env");
    }

    if (!password) {
      throw new Error("ADMIN_PASSWORD missing in .env");
    }

    /*
      Password ko yahin hash kar rahe hain.
      Isliye User model ke pre-save hook
      par dependency nahi rahegi.
    */

    const hashedPassword = await bcrypt.hash(password, 12);

    const existingAdmin = await User.findOne({
      email,
    });

    if (existingAdmin) {
      /*
        Existing account employee ho
        ya admin - forcefully admin banega
        aur password reset hoga.
      */

      await User.updateOne(
        {
          _id: existingAdmin._id,
        },
        {
          $set: {
            name,
            email,

            password: hashedPassword,

            role: "admin",

            designation: "Admin / Manager",

            active: true,
          },
        },
      );

      console.log("");
      console.log("✅ Existing account updated to Admin");
    } else {
      /*
        Account nahi hai to directly
        create karenge.

        User.create use nahi karenge,
        warna model ka pre-save hook
        password ko second time hash
        kar sakta hai.
      */

      await User.collection.insertOne({
        name,
        email,

        password: hashedPassword,

        role: "admin",

        designation: "Admin / Manager",

        active: true,

        createdAt: new Date(),

        updatedAt: new Date(),
      });

      console.log("");
      console.log("✅ New Admin account created");
    }

    console.log("");
    console.log(`Email: ${email}`);

    console.log("Password reset successfully.");

    console.log("Role: admin");

    console.log("");
    console.log("✅ ADMIN ACCOUNT READY");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("❌ Admin setup failed:");

    console.error(error.message);

    process.exit(1);
  }
};

setupAdmin();

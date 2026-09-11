import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },

    designation: {
      type: String,
      default: "Employee",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "save",
  async function (next) {
    try {
      if (!this.isModified("password")) {
        return next();
      }

      this.password = await bcrypt.hash(
        this.password,
        10
      );

      next();
    } catch (error) {
      next(error);
    }
  }
);

userSchema.methods.comparePassword =
  function (candidatePassword) {
    return bcrypt.compare(
      candidatePassword,
      this.password
    );
  };

export default mongoose.model(
  "User",
  userSchema
);
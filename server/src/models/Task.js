import mongoose from "mongoose";

const taskSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      client: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "Client",

        default: null,
      },

      assignedTo: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,

        ref: "User",

        required: true,
      },

      priority: {
        type: String,

        enum: [
          "Low",
          "Medium",
          "High",
          "Urgent",
        ],

        default:
          "Medium",
      },

      dueDate: {
        type: Date,

        default: null,
      },

      status: {
        type: String,

        enum: [
          "To Do",
          "In Progress",
          "Blocked",
          "Done",
        ],

        default:
          "To Do",
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Task",
  taskSchema
);
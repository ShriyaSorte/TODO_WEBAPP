const mongoose = require("mongoose");

const taskSchema = mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    dueDate: { type: Date },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
    },
    status: {
      type: String,
      enum: ["Completed", "In Progress", "Not started"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        permission: { type: String, enum: ["Edit", "View"] },
      },
    ],
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);

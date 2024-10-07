const mongoose = require("mongoose");

const InviteSchema = mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  invitedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["Not started", "Completed", "In Progress"],
    default: "Not started",
  },
  invitedAt: {
    type: Date,
    required: Date.now,
  },
});

module.exports = mongoose.model("Invite", InviteSchema);

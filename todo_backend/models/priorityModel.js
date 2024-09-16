const mongoose = require("mongoose");

const PrioritySchema = new mongoose.Schema({
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Low",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Priority", PrioritySchema);

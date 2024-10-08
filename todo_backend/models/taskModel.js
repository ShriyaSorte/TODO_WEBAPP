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

// {
//   "title": "Clean house",
//   "description": "Daily work",
//   "dueDate": "2024-09-15",
//   "priority": "High",
//   "status": "Incomplete",
//   "createdBy" : "66e5a138739ff410b84117fa",
//   "collaborators" : [
//     {
//         "user" : "66e13af9e4072b5b6c54b9dd",
//         "permission" : "Edit"
//     },
//     {
//         "user" : "66e135987e85e3f17b34c91f",
//         "permission" : "View"
//     }
//   ]
// }

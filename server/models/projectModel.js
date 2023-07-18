const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Untitled",
    },
    description: {
      type: String,
      default: "Not set!",
    },
    category: {
      type: String,
      default: "Not set!",
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Projects", projectSchema);

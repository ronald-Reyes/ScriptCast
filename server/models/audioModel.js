const mongoose = require("mongoose");

const audioSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Untitled",
    },
    bin64: {
      type: String,
      required: true,
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    include: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("AudioFiles", audioSchema);

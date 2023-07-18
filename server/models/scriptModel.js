const mongoose = require("mongoose");

const scriptSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Projects",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Script",
    },
    lines: {
      type: Array,
      default: [
        {
          caster: "Caster 0",
          line: "The quick brown fox jumps over the lazy dog",
          marks: [],
        },
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Scripts", scriptSchema);

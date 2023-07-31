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
      unique: true,
    },
    title: {
      type: String,
      default: "Untitled Script",
    },
    lines: {
      type: Array,
      default: [
        {
          caster: "- Caster 0",
          line: "You can type your script here or speak while the mic is listening. Hover over and click the speech recognition icon to start listening. Then click the start button to play. Enjoy!!!",
          marks: [],
          edits: {
            bgcolor: "black",
            fontcolor: "white",
            text: "Text",
            position: {
              x: 320,
              y: 180,
            },
            font: "30px Arial",
            recordingId: "",
            duration: 15000,
          },
        },
      ],
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Scripts", scriptSchema);

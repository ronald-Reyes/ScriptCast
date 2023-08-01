const ScriptModel = require("../models/scriptModel");

module.exports.updateLine = async (req, res, next) => {
  try {
    const { line, index, _id } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      { $set: { [`lines.${index}.line`]: line } }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.undoRedo = async (req, res, next) => {
  try {
    const { _id, script } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      { $set: { ...script } }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.updateEdits = async (req, res, next) => {
  try {
    const { line, index, _id } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      { $set: { [`lines.${index}`]: line } }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.updateCaster = async (req, res, next) => {
  try {
    const { caster, index, _id } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      { $set: { [`lines.${index}.caster`]: caster } }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.updateTitle = async (req, res, next) => {
  try {
    const { title, _id } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      { $set: { [`title`]: title } }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.deleteAll = async (req, res, next) => {
  try {
    const { _id } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      { $set: { [`lines`]: [] } }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.addLine = async (req, res, next) => {
  try {
    const { _id, index } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      {
        $push: {
          lines: {
            $position: index,
            $each: [
              {
                caster: `- Caster`,
                line: "Input new line here......",
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
                  duration: 2000,
                },
              },
            ],
          },
        },
      }
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.deleteLine = async (req, res, next) => {
  try {
    const { _id, index } = req.body;

    const updatedScript = await ScriptModel.updateOne(
      {
        _id,
      },
      [
        {
          $set: {
            lines: {
              $concatArrays: [
                { $slice: ["$lines", index] },
                {
                  $slice: ["$lines", { $add: [1, index] }, { $size: "$lines" }],
                },
              ],
            },
          },
        },
      ]
    );
    if (updatedScript) return res.json({ status: true, updatedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.deleteScript = async (req, res, next) => {
  try {
    const { projectId } = req.body;

    const deletedScript = await ScriptModel.deleteOne({
      projectId,
    });
    if (deletedScript) return res.json({ status: true, deletedScript });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

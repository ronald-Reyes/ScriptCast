const AudioModel = require("../models/audioModel");
var Mongoose = require("mongoose");

module.exports.fetchAllAudio = async (req, res, next) => {
  try {
    const { projectId } = req.body;
    const audioArray = await AudioModel.aggregate([
      {
        $match: {
          projectId: new Mongoose.Types.ObjectId(projectId),
        },
      },
    ]);
    return res.json({ status: true, audioArray });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.uploadAudio = async (req, res, next) => {
  try {
    const { name, bin64, projectId, include } = req.body;
    const audioCreated = await AudioModel.create({
      name,
      bin64,
      projectId,
      include,
    });
    if (audioCreated) return res.json({ status: true, audioCreated });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.removeAudio = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const audioDeleted = await AudioModel.deleteOne({ _id });
    if (audioDeleted) return res.json({ status: true, audioDeleted });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.setAudioIncluded = async (req, res, next) => {
  try {
    const { _id, include } = req.body;
    const projectUpdated = await AudioModel.updateOne(
      { _id },
      { $set: { include } }
    );
    if (projectUpdated) return res.json({ status: true, projectUpdated });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

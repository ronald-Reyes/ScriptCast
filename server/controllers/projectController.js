const ProjectModel = require("../models/projectModel");
const ScriptModel = require("../models/scriptModel");
var Mongoose = require("mongoose");

module.exports.getAllProjects = async (req, res, next) => {
  try {
    const { authorId } = req.body;
    const projects = await ProjectModel.aggregate([
      {
        $match: {
          authorId: new Mongoose.Types.ObjectId(authorId),
        },
      },
    ]);
    return res.json({ status: true, projects });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.getProject = async (req, res, next) => {
  try {
    const { authorId } = req.body;
    const _id = req.params.itemId;
    const getProject = () =>
      ProjectModel.aggregate([
        {
          $match: {
            _id: new Mongoose.Types.ObjectId(_id),
          },
        },
        {
          $lookup: {
            from: "scripts",
            localField: "_id",
            foreignField: "projectId",
            as: "script",
          },
        },
        {
          $unwind: "$script",
        },
        {
          $project: {
            __v: 0,
            "script.__v": 0,
            "script.createdAt": 0,
            "script.updatedAt": 0,
          },
        },

        //add aggrregate pipeline to get the script
      ]);
    const project = await getProject();
    if (project.length !== 0) {
      return res.json({ status: true, project: project[0] });
    } else {
      await ScriptModel.create({ projectId: _id, authorId });
      const project = await getProject();
      return res.json({ status: true, project: project[0] });
    }
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.createProject = async (req, res, next) => {
  try {
    const { name, description, category, authorId } = req.body;
    const projectCreated = await ProjectModel.create({
      name,
      description,
      category,
      authorId,
    });
    if (projectCreated) return res.json({ status: true, projectCreated });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.deleteProject = async (req, res, next) => {
  try {
    const { _id } = req.body;
    const projectDeleted = await ProjectModel.deleteOne({ _id });
    if (projectDeleted) return res.json({ status: true, projectDeleted });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};
module.exports.updateProject = async (req, res, next) => {
  try {
    const { _id, projectUpdate } = req.body;
    const projectUpdated = await ProjectModel.updateOne(
      { _id },
      { $set: { ...projectUpdate } }
    );
    if (projectUpdated) return res.json({ status: true, projectUpdated });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

const {
  createProject,
  deleteProject,
  updateProject,
  getProject,
  getAllProjects,
} = require("../controllers/projectController");

const router = require("express").Router();

//router.post("/getAllProjects", getAllProjects);
//router.post("/getProject", getProject);
router.post("/create", createProject);
router.post("/delete", deleteProject);
router.post("/update", updateProject);
router.post("/getAll", getAllProjects);
router.post("/:itemId", getProject);

module.exports = router;

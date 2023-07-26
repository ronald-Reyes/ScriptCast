const {
  updateLine,
  updateCaster,
  addLine,
  deleteAll,
  deleteLine,
  updateTitle,
  deleteScript,
  updateEdits,
} = require("../controllers/scriptController");

const router = require("express").Router();

router.post("/update-line", updateLine);
router.post("/update-caster", updateCaster);
router.post("/update-title", updateTitle);
router.post("/delete-all", deleteAll);
router.post("/add-line", addLine);
router.post("/delete-line", deleteLine);
router.post("/delete-script", deleteScript);
router.post("/update-edits", updateEdits);

module.exports = router;

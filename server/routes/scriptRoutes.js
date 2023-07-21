const {
  updateLine,
  updateCaster,
  addLine,
  deleteAll,
  deleteLine,
  updateTitle,
} = require("../controllers/scriptController");

const router = require("express").Router();

router.post("/update-line", updateLine);
router.post("/update-caster", updateCaster);
router.post("/update-title", updateTitle);
router.post("/delete-all", deleteAll);
router.post("/add-line", addLine);
router.post("/delete-line", deleteLine);

module.exports = router;

const {
  fetchAllAudio,
  uploadAudio,
  removeAudio,
  updateAudio,
  deleteMany,
} = require("../controllers/audioControllers");

const router = require("express").Router();

router.post("/getAll", fetchAllAudio);
router.post("/upload", uploadAudio);
router.post("/remove", removeAudio);
router.post("/deleteMany", deleteMany);
router.post("/updateAudio", updateAudio);

module.exports = router;

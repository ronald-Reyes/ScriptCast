const {
  fetchAllAudio,
  uploadAudio,
  removeAudio,
  setAudioIncluded,
} = require("../controllers/audioControllers");

const router = require("express").Router();

router.post("/getAll", fetchAllAudio);
router.post("/upload", uploadAudio);
router.post("/remove", removeAudio);
router.post("/setAudio", setAudioIncluded);

module.exports = router;

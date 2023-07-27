const { renderVideo } = require("../controllers/videoControllers");

const router = require("express").Router();

router.post("/render", renderVideo);

module.exports = router;

const { renderVideo, getVideo } = require("../controllers/videoControllers");

const router = require("express").Router();

router.post("/render", renderVideo);
router.get("/:fileName", getVideo);

module.exports = router;

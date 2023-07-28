const { ffmpegCLI } = require("../FFMPEG/FFMPEG-CLI");
const fs = require("fs-extra");

module.exports.renderVideo = async (req, res, next) => {
  try {
    const { images, config } = req.body;
    const configFile = JSON.parse(config);
    await ffmpegCLI(images, configFile);
    return res.json({ status: true, config });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.getVideo = async (req, res, next) => {
  try {
    const fileName = req.params.fileName;
    const stat = await fs.stat(`output/${fileName}.mp4`);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(`output/${fileName}.mp4`, {
        start,
        end,
      });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      const readable = fs.createReadStream(`output/${fileName}.mp4`).pipe(res);
      readable.on("end", () => {
        console.log("All the data is being consumed.");
      });
    }
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

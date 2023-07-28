const fs = require("fs-extra");
const util = require("util");

const exec = util.promisify(require("child_process").exec);

const debug = false;
const videoEncoder = "h264";

module.exports.ffmpegCLI = async (images, { projectId, script }) => {
  try {
    if (projectId === undefined) return;
    const { lines } = script;
    //create a temp folder
    await fs.mkdir(`./${projectId}`);
    await fs.mkdir(`./${projectId}/raw-images`);
    await fs.writeFile(`./${projectId}/concat.txt`, "");

    //save the images
    for (let i = 0; i < images.length; i++) {
      const dataUrl = images[i];
      const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
      //saves the images to the created dir
      await fs.writeFile(`./${projectId}/raw-images/${i}.png`, buffer);

      //creates a txt configuration required to merge the images
      if (i !== images.length - 1)
        await fs.appendFile(
          `./${projectId}/concat.txt`,
          `${i !== 0 ? `\n` : ``}file raw-images/${i}.png\noutpoint ${
            lines[i].edits.duration / 1000
          }`
        );
    }
    //Additional config for the last frame which is the logo
    await fs.appendFile(
      `./${projectId}/concat.txt`,
      `\nfile raw-images/${images.length - 1}.png\noutpoint 5`
    );

    //executes the ffmpeg command;
    await exec(
      `ffmpeg -f concat -i ${projectId}/concat.txt -c:v libx264 -r 30 -pix_fmt yuv420p -y output/${projectId}.mp4`
    );

    //deletes the temporary folder after creating the output.mp4
    await fs.remove(`./${projectId}`);
  } catch (error) {
    console.log(error);
    await fs.remove(`./${projectId}`);
  }
};

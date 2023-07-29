const fs = require("fs-extra");
const util = require("util");

const exec = util.promisify(require("child_process").exec);

const debug = false;
const videoEncoder = "h264";

module.exports.ffmpegCLI = async (
  images,
  { projectId, script, audioArray }
) => {
  try {
    if (projectId === undefined) return;
    const { lines } = script;

    //create a temp folder
    await fs.mkdir(`./${projectId}`);
    await fs.mkdir(`./${projectId}/raw-images`);
    await fs.writeFile(`./${projectId}/concat.txt`, "");

    //save the images and create concatenation.txt needed for ffmpeg command
    for (let i = 0; i < images.length; i++) {
      const dataUrl = images[i];
      const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
      await fs.writeFile(`./${projectId}/raw-images/${i}.png`, buffer);

      //txt part
      if (i !== images.length - 1)
        await fs.appendFile(
          `./${projectId}/concat.txt`,
          `${i !== 0 ? `\n` : ``}file raw-images/${i}.png\noutpoint ${
            lines[i].edits.duration / 1000
          }`
        );
    }
    //additional for txt part
    await fs.appendFile(
      `./${projectId}/concat.txt`,
      `\nfile raw-images/${images.length - 1}.png\noutpoint 5`
    );

    //executes the ffmpeg command that combines the images into single video based on the duration provided in config;
    //sample command
    //ffmpeg -f concat -i in.txt -c:v libx264 -r 30 -pix_fmt yuv420p -y black.mp4
    await exec(
      `ffmpeg -f concat -i ${projectId}/concat.txt -c:v libx264 -r 30 -pix_fmt yuv420p -y ${projectId}/output.mp4`
    );

    //executes the ffmpeg command that adds audio from the generated audio
    //sample command
    //ffmpeg -i 1.mp3 -i 2.mp3 -i 3.mp3 -i 4.mp3 -i 1.mp4 -filter_complex "[0:a]adelay=2790|2790[s0]; [1:a]adelay=10300|10300[s1]; [2:a]adelay=14930|14930[s2];[3:a]adelay=21090|21090[s3];[s0][s1][s2][s3] amix=inputs=4:duration=longest [mixout]"  -map 4:v -map [mixout] -c:v copy -y result.mp4
    const part0 = "ffmpeg ";
    let part1 = "";
    const part2 = ` -i ${projectId}/output.mp4 -filter_complex "`;
    let part3 = "";
    let part4 = "";
    const part5 = ` amix=inputs=${audioArray.length}:duration=longest [mixout]"`;
    const part6 = ` -map ${audioArray.length}:v -map [mixout] -c:v copy -y output/${projectId}.mp4`;
    for (let i = 0; i < audioArray.length; i++) {
      const dataUrl = audioArray[i].bin64;
      const buffer = Buffer.from(dataUrl.split(",")[1], "base64");
      //saves the mp3 to the created dir
      await fs.writeFile(`./${projectId}/${i}.mp3`, buffer);

      part1 += ` -i ${projectId}/${i}.mp3`;
      part3 += `[${i}:a]adelay=${audioArray[i].include.startTime * 1000}|${
        audioArray[i].include.startTime * 1000
      }[s${i}]; `;
      part4 += `[s${i}]`;
    }
    const cmd = part0 + part1 + part2 + part3 + part4 + part5 + part6;
    await exec(cmd);

    //deletes the temporary folder after creating the output.mp4
    await fs.remove(`./${projectId}`);
  } catch (error) {
    console.log(error);
    await fs.remove(`./${projectId}`);
  }
};

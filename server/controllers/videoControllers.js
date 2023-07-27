module.exports.renderVideo = async (req, res, next) => {
  try {
    const { images, config } = req.body;
    const configFile = JSON.parse(config);
    return res.json({ status: true, config });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

const UserModel = require("../models/userModel");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await UserModel.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await UserModel.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });

    const user = await UserModel.create({
      email,
      username,
      password,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });

    if (!user || !(await user.comparePassword(password)))
      return res.json({ msg: "Incorrect username or password", status: false });

    delete user.password;
    return res.json({ status: true, user: user });
  } catch (err) {
    //Error Handling passed to the frontend
    return res.json({ status: false, msg: err.message });
  }
};

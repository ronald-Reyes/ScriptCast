const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      maxLength: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

async function generateHash(password) {
  const COST = 12;
  return bcrypt.hash(password, COST);
}

userSchema.pre("save", function preSave(next) {
  const user = this;

  if (user.isModified("password")) {
    return generateHash(user.password)
      .then((hash) => {
        user.password = hash;
        return next();
      })
      .catch((error) => {
        return next(error);
      });
  }
  return next();
});

userSchema.methods.comparePassword = async function confirm(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model("Users", userSchema);

import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

//user
const Users = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  userRole: {
    type: String,
    enum: ["admin", "user"],
    required: false,
  },
});



//signup method
Users.statics.signup = async function (username, password, userRole) {
  if (!username || !password || !userRole) {
    throw Error("All fields are required");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }
  const exist = await this.findOne({ username });
  if (exist) {
    throw Error("username or password already exist, login instead");
  }
  const salt = await bcrypt.genSalt(10);

  const hash = await bcrypt.hash(password, salt);
  const newUser = await this.create({
    username,
    password: hash,
    userRole,
  });
  return newUser;
};

//login method
Users.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Incorrect username");
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

export default mongoose.model("User", Users);

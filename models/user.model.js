const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  username: { type: String, default: "", required: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

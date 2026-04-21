const mongoose = require("mongoose");

const schema = mongoose.Schema;

const questionSchema = new schema({
  text: {
    type: String,
  },
  Author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  options: [
    {
      type: String,
    },
  ],
  keywords: [
    {
      type: String,
    },
  ],
  correctAnswerIndex: {
    type: Number,
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;

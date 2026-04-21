const mongoose = require("mongoose");

const schema = mongoose.Schema;

const quizSchema = new schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;

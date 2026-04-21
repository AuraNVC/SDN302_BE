const Question = require("../models/question.model");
const Quiz = require("../models/quiz.model");

const getAllQuestions = async (req, res) => {
  try {
    const questionsData = await Question.find();
    if (!questionsData) {
      return res.status(404).json({ message: "Not found any question" });
    }
    return res.status(200).json(questionsData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getDatailQuestion = async (req, res) => {
  try {
    const id = req.params.questionId;
    const quesData = await Question.findById({ _id: id });
    if (!quesData) {
      return res.status(404).json({ message: "Not found question" });
    }
    return res.status(200).json(quesData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createQues = async (req, res) => {
  try {
    const quesForm = req.body;
    const newQues = new Question({
      text: quesForm.text,
      Author: req.user._id,
      options: quesForm.options,
      keywords: quesForm.keywords,
      correctAnswerIndex: quesForm.correctAnswerIndex,
    });
    const quesData = await newQues.save();

    if (!quesData) {
      return res.status(400).json({ message: "Create question fail" });
    }

    return res.status(201).json(quesData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateQues = async (req, res) => {
  try {
    const id = req.params.questionId;
    const updateQuesForm = req.body;

    const quesUpdate = await Question.findByIdAndUpdate(
      { _id: id },
      updateQuesForm,
      { new: true },
    );

    if (!quesUpdate) {
      return res.status(400).json({ message: "Update question fail" });
    }
    return res.status(200).json({ message: "Update successful!", question: quesUpdate });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteQues = async (req, res) => {
  try {
    const id = req.params.questionId;
    const quizWithQuesId = await Quiz.findOne({
      questions: id,
    });

    if (quizWithQuesId) {
      await Quiz.findByIdAndUpdate(
        { _id: quizWithQuesId._id },
        { $pull: { questions: id } },
      );
    }
    const delQues = await Question.findByIdAndDelete({ _id: id });

    if (!delQues) {
      return res.status(400).json({ message: `Delete question: ${id} fail` });
    }

    return res.status(200).json(`Delete successfully`);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllQuestions,
  getDatailQuestion,
  createQues,
  updateQues,
  deleteQues,
};

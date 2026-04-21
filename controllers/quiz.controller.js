const Quiz = require("../models/quiz.model");
const Question = require("../models/question.model");

const getAllQuizzes = async (req, res) => {
  try {
    const quizzesData = await Quiz.find().populate({ path: "questions" });

    if (!quizzesData) {
      return res.status(404).json({ message: "Not found any quiz" });
    }

    return res.status(200).json(quizzesData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuizWithCapital = async (req, res) => {
  try {
    const id = req.params.quizId;
    const quizzesData = await Quiz.findById({ _id: id }).populate({
      path: "questions",
      match: { text: { $regex: "capital" } },
    });

    if (!quizzesData) {
      return res.status(404).json({ message: "Not found any question" });
    }

    return res.status(200).json(quizzesData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createQuesInQuiz = async (req, res) => {
  try {
    const id = req.params.quizId;
    const { text, options, keywords, correctAnswerIndex } = req.body;
    const newQues = new Question({
      text,
      Author: req.user._id,
      options,
      keywords,
      correctAnswerIndex,
    });

    await newQues.save().then(async (newQues) => {
      const upQuiz = await Quiz.findByIdAndUpdate(
        { _id: id },
        { $push: { questions: newQues._id } },
        { returnDocument: "after" },
      ).populate({ path: "questions" });

      if (!upQuiz) {
        return res
          .status(400)
          .json({ message: `Create question in quiz: ${id} fail` });
      }
      return res.status(201).json({ message: "Update successful!", quiz: upQuiz });
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const createManyQuesInQuiz = async (req, res) => {
  try {
    const id = req.params.quizId;
    let questionData = req.body;
    if (!Array.isArray(questionData)) {
      questionData = [questionData];
    }

    const questionsWithAuthor = questionData.map((ques) => ({
      ...ques,
      Author: req.user._id,
    }));

    const newQuestion = await Question.insertMany(questionsWithAuthor).then(
      async (newQues) => {
        const questionIds = newQues.map((ques) => ques._id);
        const upQuiz = await Quiz.findByIdAndUpdate(
          { _id: id },
          { $push: { questions: { $each: questionIds } } },
          { new: true },
        ).populate({ path: "questions" });

        if (!upQuiz) {
          return res
            .status(400)
            .json({ message: `Create questions in quiz: ${id} fail` });
        }
        return res
          .status(201)
          .json({ message: "Update successful!", quiz: upQuiz });
      },
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const id = req.params.quizId;
    const quizData = await Quiz.findById({ _id: id }).populate({
      path: "questions",
    });

    if (!quizData) {
      return res.status(404).json({ message: "Not found quiz" });
    }

    return res.status(200).json(quizData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz({
      title: req.body.title,
      description: req.body.description,
      questions: req.body.questions,
    });

    newQuiz.save().then((newQuiz) => {
      if (!newQuiz) {
        return res.status(400).json({ message: "Create quiz fail" });
      }
      return res.status(201).json(newQuiz);
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const id = req.params.quizId;

    let updateForm = req.body;

    if (updateForm.questions && Array.isArray(updateForm.questions)) {
      const questionsWithAuthor = updateForm.questions.map((ques) => ({
        ...ques,
        Author: req.user._id,
      }));
      const newQuestions = await Question.insertMany(questionsWithAuthor);
      
      console.log(newQuestions)
      const quesIds = newQuestions.map((ques) => ques._id);
      updateForm.questions = quesIds;
    }
    const newQuiz = await Quiz.findByIdAndUpdate({ _id: id }, updateForm, {
      new: true,
    }).populate({ path: "questions" });

    if (!newQuiz) {
      return res.status(400).json({ message: "Update quiz fail" });
    }

    return res.status(200).json({ message: "Update successful!", quiz: newQuiz });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const id = req.params.quizId;
    const quizData = await Quiz.findById({ _id: id });
    if (quizData.questions && quizData.questions.length > 0) {
      await Question.deleteMany({
        _id: { $in: quizData.questions },
      });
    }

    const deletedQuiz = Quiz.findByIdAndDelete({ _id: id }).then(
      (deletedQuiz) => {
        if (!deleteQuiz) {
          return res.status(400).json({ message: `Delete quiz: ${id} fail` });
        }

        return res
          .status(200)
          .json({ message: `Delete ${deletedQuiz._id} successfully` });
      },
    );
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getQuizWithCapital,
  createQuesInQuiz,
  createManyQuesInQuiz,
};

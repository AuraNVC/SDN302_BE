const express = require("express");

const {
  verifyUser,
  verifyAdmin,
  verifyAuthor,
} = require("../middleware/authenticate");

const quizController = require("../controllers/quiz.controller");

const quizRouter = express.Router();

quizRouter.use(express.json());
quizRouter.use(express.urlencoded({ extended: true }));

quizRouter
  .route("/")
  .get(verifyUser, quizController.getAllQuizzes)
  .post(verifyUser, verifyAdmin, quizController.createQuiz);

quizRouter
  .route("/:quizId")
  .get(verifyUser, quizController.getQuizById)
  .put(verifyUser, verifyAdmin, quizController.updateQuiz)
  .delete(verifyUser, verifyAdmin, quizController.deleteQuiz);

quizRouter
  .route("/:quizId/populate")
  .get(verifyUser, verifyAdmin, quizController.getQuizWithCapital);

quizRouter
  .route("/:quizId/question")
  .post(verifyUser, verifyAdmin, quizController.createQuesInQuiz);

quizRouter
  .route("/:quizId/questions")
  .post(verifyUser, verifyAdmin, quizController.createManyQuesInQuiz);

module.exports = quizRouter;

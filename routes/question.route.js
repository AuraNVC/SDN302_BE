const express = require("express");

const {
  verifyUser,
  verifyAdmin,
  verifyAuthor,
} = require("../middleware/authenticate");

const questionsController = require("../controllers/question.controller");

const questionRouter = express.Router();

questionRouter.use(express.json());
questionRouter.use(express.urlencoded({ extended: true }));

questionRouter
  .route("/")
  .get(verifyUser, questionsController.getAllQuestions)
  .post(verifyUser, verifyAdmin, questionsController.createQues);

questionRouter
  .route("/:questionId")
  .get(verifyUser, questionsController.getDatailQuestion)
  .put(verifyUser, verifyAdmin, verifyAuthor, questionsController.updateQues)
  .delete(
    verifyUser,
    verifyAdmin,
    verifyAuthor,
    questionsController.deleteQues,
  );

module.exports = questionRouter;

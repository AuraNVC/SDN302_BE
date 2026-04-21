const express = require("express");

const {
  verifyUser,
  verifyAdmin,
  verifyAuthor,
} = require("../middleware/authenticate");

const userController = require("../controllers/user.controller");

const userRouter = express.Router();

userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

userRouter.route("/").get(verifyUser, verifyAuthor, userController.getAllUser);

userRouter.route("/register").post(userController.register);

userRouter.route("/login").post(userController.login);

module.exports = userRouter;

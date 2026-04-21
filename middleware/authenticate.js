const jwt = require("jsonwebtoken");

const secret_key = process.env.JWT_SERCRET;

const Question = require("../models/question.model");

const verifyUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Can not authenticate" });
    }

    const verified = jwt.verify(token, secret_key);
    if (!verified) {
        return res.status(403).json({message: 'No token provided!'})
    }
    req.user = verified;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.admin) {
      return res.status(403).json({message: 'You are not authorized to perform this operation!'});
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const verifyAuthor = async (req, res, next) => {
  try {
    Question.findById(req.params.questionId).then((question) => {
      if (!question) {
        return res.status(403).json({message: 'Question not found'})
      }
      if (question.Author.equals(req.user._id)) {
        next();
      } else {
        return res.status(403).json({message: 'You are not the author of this question'});
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { verifyUser, verifyAdmin, verifyAuthor };

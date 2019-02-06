const { promisify } = require('util');
const nodemailer = require('nodemailer');
const passport = require('passport');
const Question = require('../models/Question');
const toTitleCase = require('../utils/toTitleCase');

/**
 * GET /questionByID
 * Return question with id in request
*/
exports.getQuestionByID = (req, res) => {
  Question.findById(req.id, res);
};

/**
 * GET /questions
 * Return all questions
*/
exports.getQuestionByID = (req, res) => {
  const query = {_id: req.id}
  Question.find({}, res);
};

/**
 * GET /create/question
 * Create a new question
*/
exports.getCreateQuestion = (req, res) => {
  res.render('createQuestion', {});
};

/**
 * POST /create/question
 * Create new question
 */
exports.addQuestion = (req, res, next) => {

  console.log(req.body);

  Question.findOne({question: req.body.question}, (err, existingQuestion) => {
    if (err) { return next(err); }

    // Question doesn't yet exist
    var options = [req.body.option1, req.body.option2, req.body.option3, req.body.option4];

    const question = new Question({
      question: req.body.question || '',
      options: options || '',
      correctAnswers: req.body.correctAnswers || ''
    });

    Question.findOne({ question: req.body.question }, (err, existingQuestion) => {
      if (err) { return next(err); }
      if (existingQuestion) {
        req.flash('errors', { msg: 'That question (exact wording) already exists.' });
        return res.redirect('/create/question');
      }
      question.save((err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Question successfully created.' });
        res.redirect('/create/question');
      });
    });
  });
};


/**
 * POST /newQuestion
 * Create a new question.
 */
exports.postNewQuestion = (req, res, next) => {
  /* Serverside code to validate user input
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/dashboard');
  }
  */
  console.log('New question added');
  const question = new Question({
    question: req.body.question,
    options: req.body.options,
    correctAnswers: req.body.correctAnswers
  });

  Question.findOne({ question: req.body.question }, (err, existingQuestion) => {
    if (err) { return next(err); }
    if (existingQuestion) {
      req.flash('errors', { msg: 'That question already exists.' });
      return res.redirect('/');
    }
    question.save((err) => {
      if (err) { return next(err); }
    });
  });
};

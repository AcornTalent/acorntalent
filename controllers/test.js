const { promisify } = require('util');
const nodemailer = require('nodemailer');
const passport = require('passport');
const Test = require('../models/Test');
const toTitleCase = require('../utils/toTitleCase');

/**
 * GET /tests
 * List all tests.
*/
exports.getTests = (req, res) => {
  Test.find((err, docs) => {
    res.render('tests', { tests: docs});
  });
};

/**
 * POST /newTest
 * Create a new test.
 */
exports.postNewTest = (req, res, next) => {
  /* Serverside code to validate user input
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/dashboard');
  }
  */
  console.log('hi');
  const test = new Test({
    name: req.body.name,
    description: req.body.description,
    questions: req.body.questions,
    options: req.body.options,
    correctAnswers: req.body.correctAnswers
  });

  Test.findOne({ name: req.body.name }, (err, existingTest) => {
    if (err) { return next(err); }
    if (existingTest) {
      req.flash('errors', { msg: 'Test with that name already exists.' });
      return res.redirect('/');
    }
    test.save((err) => {
      if (err) { return next(err); }
    });
  });
};

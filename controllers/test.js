const { promisify } = require('util');
const nodemailer = require('nodemailer');
const passport = require('passport');
const Test = require('../models/Test');
const Question = require('../models/Question');
const toTitleCase = require('../utils/toTitleCase');

/**
 * GET /tests
 * List all tests.
*/
exports.getTests = (req, res) => {
  Test.find((err, docs) => {
    console.log(docs);
    for(var test in docs)
    {

    }
    res.render('tests', { tests: docs});
  });
};

/**
 * GET /currTest
 * Pull up current test
*/
exports.getCurrTest = (req, res) => {
  const query = {_id: req.params.testID};
  console.log(query);
  Test.findOne(query, (err, test) => {
    /*if(test.questionsID == null)
    {
      req.flash('errors', { msg: 'No questions in test. :o' });
      return res.redirect('/dashboard');
    }*/
    console.log(test);
    res.render('currTest', { test: test});
  });
};

/**
 * GET /createTest
 * Pull up current test
*/
exports.getCreateTest = (req, res) => {
  Question.find((err, questions) => {
    res.render('createTest', {questions: questions});
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
  const test = new Test({
    name: req.body.name,
    description: req.body.description,
    questionsID: req.body.questionsID,
    optionsID: req.body.optionsID,
    correctAnswersID: req.body.correctAnswersID
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

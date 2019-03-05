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

/**
 * POST /addQuestion
 * Add a new question.
 */
exports.addQuestions = (req, res, next) => {
  /* Serverside code to validate user input
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/dashboard');
  }
  */

  Test.findOne({ name: req.body.name }, (err, existingTest) => {


    Test.findOne({ name: req.body.name }, (err, existingTest) => {
      if (err) { return next(err); }
      if (!existingTest) {
        existingTest = new Test({
          name: req.body.name,
          description: req.body.description
        });
        req.flash('Failed', { msg: 'Test already exists. You may modify the test by making changes and pressing save.' }); // not working fix this
      }
      console.log(req.body);
      if(existingTest.questionsID === undefined || existingTest.questionsID.length == 0)
      {
        existingTest.questionsID = [];
        var questionName;
        for(var i = 0;; i++)
        {
          questionName = 'question'+i;
          if(!(req.body[questionName] === undefined))
          {
            console.log(req.body[questionName]);
            if(req.body[questionName] != '-1')
            {
              existingTest.questionsID.push(req.body[questionName]);
            }
          }
          else break; // this logic prevents the code from running synchrously
          // despite req.body[questionName] being non existant
        }
      }
      else {
        for(var values in req.body.isAdded)
        {
          if(!values.equals('notAdded') && equals(questionID, values))
          {
            for(var questionID in existingTest.questionsID)
            {
              console.log('yay');
              break;
            }
            console.log('yay');
          }

        }
      }
      existingTest.save((err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Test saved.' });
        res.redirect('/dashboard');
      });
    });

/*
    if (err) { return next(err); }
    if (!existingTest) {
      existingTest = new Test({
        name: req.body.name,
        description: req.body.description,
        questionsID: req.body.questionsID,
        optionsID: req.body.optionsID,
        correctAnswersID: req.body.correctAnswersID
        });
      }
    if(existingTest.questionsID === undefined || array.length == 0)
    {
      for(var questionID in existingTest.questionsID)
      {
        for(var index in req.body.isAdded)
        {
          if(questionID == req.body.isAdded[index])
          {
            console.log('yay!');
          }
        }
      }
    }
    else {
      console.log('nah');
    }
    existingTest.save((err) => {
      if (err) { return next(err); }
    });
    return next(); */
  });
};

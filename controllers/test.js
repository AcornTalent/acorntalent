const { promisify } = require('util');
const nodemailer = require('nodemailer');
const passport = require('passport');
const Test = require('../models/Test');
const Question = require('../models/Question');
const User = require('../models/User');
const toTitleCase = require('../utils/toTitleCase');
const sleep = require('sleep');

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
 * GET /test/:testID
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
    if (err) { return next(err); }
    if (!existingTest) {
      existingTest = new Test({
        name: req.body.name,
        description: req.body.description
      });
      req.flash('Failed', { msg: 'Test already exists. You may modify the test by making changes and pressing save.' }); // not working fix this
      res.redirect('/create/test');
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
};

/**
 * POST /test/:testID/:qNumber/q/:questionID/submit
 * Submit test.
 */
exports.submitTest = (req, res, next) => {
  console.log(req)
  var ObjectId = require('mongodb').ObjectId;
  const questionQuery = {_id: req.params.questionID};
  const tID = new ObjectId(req.params.testID);
  const testQuery = {_id: tID};
  const userQuery = {_id: req.user.id};

  User.findOne(userQuery, (err, user) => {
    if(err)
    {
      req.flash('errors', { msg: 'User does not exist :('});
      return res.redirect('/login');
    }
    if(user.responses === undefined || user.responses.length == 0) user.responses = [];
    Test.findOne(testQuery, (err, test) => {
      if(err)
      {
        console.log('Test not found');
        req.flash('errors', { msg: 'Test does not exist :('});
        return res.redirect('/dashboard');
      }
      if(test) console.log(test);
      Question.findOne({_id: test.questionsID[req.params.qNumber]}, (err, question) => {
        if(err)
        {
          req.flash('errors', { msg: 'Question does not exist :('});
          return res.redirect('/dashboard');
        }
        console.log('Responses Before');
        console.log(user.responses);
        user.responses.push(req.body.question);
        console.log('Responses After');
        console.log(user.responses);

        var numQuestionsCorrect = 0;
        var numberQuestionsAnswered = user.responses.length;
        var shouldBreak = false;
        for(var index = 0; index < numberQuestionsAnswered && !shouldBreak; index++)
        {
          Question.findOne({_id: test.questionsID[index]}, (err, currQuestion) => {
            if(err)
            {
              req.flash('errors', { msg: 'Server Error. Please Contact the Site Administrator.'});
              return res.redirect('/dashboard');
            }
            console.log('Before pop');
            console.log(user.responses);

            console.log(typeof(user.responses[user.responses.length - 1]));
            console.log(user.responses[user.responses.length - 1]);
            console.log(typeof(currQuestion.correctAnswers));
            console.log(currQuestion.correctAnswers);

            console.log("one" == "one");
            if(user.responses.pop() == currQuestion.correctAnswers) numQuestionsCorrect++;
            console.log(numQuestionsCorrect);

            if(user.responses === undefined || user.responses.length == 0) shouldBreak = false;
          });
        }

        sleep.msleep(10000, (err) => {
          user.score = numQuestionsCorrect;
          console.log(numQuestionsCorrect);
        });

        user.save((err) => {
          if (err) { return next(err); }
          req.flash('success', { msg: 'Test submitted successfully!'});
          res.redirect('/test/' + req.params.testID + '/results');
        });
      });
    });
  });
};

/**
 * GET /test/:testID/results
 * Get results page.
 */
exports.getResultsPage = (req, res, next) => {
  var ObjectId = require('mongodb').ObjectId;
  const tID = new ObjectId(req.params.testID);
  const testQuery = {_id: tID};
  const userQuery = {_id: req.user.id};

  User.findOne(userQuery, (err, user) => {
    if(err)
    {
      req.flash('errors', { msg: 'User does not exist :('});
      return res.redirect('/dashboard');
    }
    console.log(user);
    Test.findOne(testQuery, (err, test) => {
      if(err)
      {
        req.flash('errors', { msg: 'Test does not exist :('});
        return res.redirect('/dashboard');
      }
      res.render('resultsPage', {user: user, test: test});
    });
  });
};

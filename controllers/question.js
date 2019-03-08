const { promisify } = require('util');
const nodemailer = require('nodemailer');
const passport = require('passport');
const Question = require('../models/Question');
const Test = require('../models/Test');
const User = require('../models/User');
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
 * GET /test/:testID/:qNumber/q/:questionID
 * Get the current question
*/
exports.getCurrQuestion = (req, res) => {
  const questionQuery = {_id: req.params.questionID};
  const testQuery = {_id: req.params.testID};

  Test.findOne(testQuery, (err, test) => {
    if(err)
    {
      req.flash('errors', { msg: 'Test does not exist :('});
      return res.redirect('/dashboard');
    }
      Question.findOne({_id: test.questionsID[req.params.qNumber]}, (err, question) => {
      if(err)
      {
        req.flash('errors', { msg: 'Question does not exist :('});
        return res.redirect('/dashboard');
      }
      console.log(test + question);
      res.render('currQuestion', { qNumber: req.params.qNumber, question: question, test: test});
    });
  });
};

/**
 * POST /test/:testID/:qNumber/q/:questionID
 * Submit the current question
*/
exports.submitCurrQuestion = (req, res) => {
  var ObjectId = require('mongodb').ObjectId;

  var qID = req.params.questionID;
  var q_ID = new ObjectId(qID);
  const questionQuery = {_id: q_ID};

  const testQuery = {_id: req.params.testID};
  const userQuery = {_id: req.user.id};


  User.findOne(userQuery, (err, user) => {
    if(err || !user)
    {
      req.flash('errors', { msg: 'User does not exist :('});
      return res.redirect('/login');
    }

    if(user.responses === undefined || user.responses.length == 0) user.responses = [];
    Test.findOne(testQuery, (err, test) => {
      if(err)
      {
        req.flash('errors', { msg: 'Test does not exist :('});
        return res.redirect('/dashboard');
      }
      Question.find({_id: test.questionsID[req.params.qNumber]}, (err, question) => {
        if(err)
        {
          req.flash('errors', { msg: 'Question does not exist :('});
          return res.redirect('/dashboard');
        }
        user.responses.push(req.body.question);
        console.log(user.responses);
        user.save((err) => {
          if(err) { return next(err); }
          else
          {
            const nextQuestion = '/test/'+test._id+'/' + (parseInt(req.params.qNumber)+1) + '/q/'+test.questionsID[parseInt(req.params.qNumber)+1];
            res.redirect(nextQuestion);
          }
        });
      });
    });
  });
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

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: Object,
  correctAnswers: Object
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;

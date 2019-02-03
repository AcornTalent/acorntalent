const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: String,
  description: String,
  questionsID: Object,
  optionsID: Object,
  correctAnswersID: Object
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

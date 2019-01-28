const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  name: String,
  description: String,
  questions: Object,
  options: Object,
  correctAnswers: Object  
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;

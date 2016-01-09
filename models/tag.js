var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tagSchema = new mongoose.Schema({
  text: {
    type: String,
    unique: true
  },
  userId: {type: String}
});

module.exports = mongoose.model('Tag', tagSchema);

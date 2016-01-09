var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  title: {
    type: String,
    trim: true,
    required: true
  },
  content: {
    type: String,
    trim: true
  },
  html: {type: String},
  added: {
    type: Date,
    default: Date.now
  },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  order: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Note', noteSchema);

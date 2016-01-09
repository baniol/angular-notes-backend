var Note = require('../models/note');
var tagController = require('./tagController');
var marked = require('marked');
//var async = require('async');

var convertToMarkdown = function (text) {
  return (text && text !== '') ? marked(text) : '';
};

exports.getNotes = function (req, res) {
  Note.find({userId: req.user._id})
    .populate('tags', 'text')
    .exec(function (err, notes) {
      if (err) {
        console.log(err);
      }
      else {
        res.json(notes);
      }
    });
};

exports.getTest = function (req, res) {
  var notes = [
    {title: 'First note', content: 'some content'},
    {title: 'Second note', content: 'some content'},
    {title: 'Third note', content: 'some content'},
    {title: 'Fourth note', content: 'some content'},
    {title: 'Fifth note', content: 'some content'},
  ];
  res.json(notes);
};

exports.postNote = function (req, res) {
  var data = req.body;
  var promise = tagController.updateTags(data.tags, req.user._id);
  promise.then(function (resTags) {
    //getOrder(req.user._id, function (int) {
    var note = Note({
      userId: req.user._id,
      title: data.title,
      content: data.content,
      html: convertToMarkdown(data.content),
      tags: resTags,
      // @TODO check ordering
      order: 0
    });
    note.save(function (err) {
      //ret.populate('tags', 'text');
      if (err) {
        console.log(err);
      }
      else {
        note.populate('tags', 'text', function (err, ret) {
          res.json(ret);
        });
      }
    });
    //});
  });
};

exports.putNote = function (req, res) {
  var data = req.body;
  // @TODO marked error handling
  var html = convertToMarkdown(data.content);
  //tagController.updateTags(data.tags, req.user._id);
  var promise = tagController.updateTags(data.tags, req.user._id);
  promise.then(function (resTags) {
    Note.findOne({_id: req.params.id}, function (err, note) {
      if (err) {
        console.log(err);
      }
      else {
        note.title = data.title;
        note.content = data.content;
        note.html = html;
        note.tags = resTags;
        note.save(function (saveErr) {
          res.json(note);
        });
      }
    });
  });
};

exports.deleteNote = function (req, res) {
  Note.remove({_id: req.params.id}, function (err) {
    if (err) {
      console.log(err);
    }
    else {
      res.send('removed');
    }
  });
};

exports.order = function (req, res) {
  req.body.forEach(function (el) {
    Note.findOne({ _id: el.id }, function (err, note){
      if (note) {
        note.order = el.order;
        note.save();
      }
    });
  });
};

function getOrder(id, cb) {
  var q = Note.find({userId: id});
  q.sort({'order': -1}).limit(1);
  q.exec( function (err, note) {
    var ret = note[0] ? note[0].order + 1 : 1;
    cb(ret);
  });
}

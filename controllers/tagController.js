var Tag = require('../models/tag');
var Note = require('../models/note');
var Q = require('q');

var getNumber = function (tags) {
  var out = [];
  var i = 0;
  var defer = Q.defer();
  var l = tags.length;
  if (l === 0) 
    defer.resolve([]);
  tags.forEach(function (t) {
    // Get the number of notes with the given tag
    Note.find({'tags': {$in: [t._id]}})
      .count()
      .exec(function (err, res){
        // @TODO error handling
        var ta = {};
        ta._id = t._id;
        ta.text = t.text;
        ta.userId = t.userId;
        ta.number = res;
        out.push(ta);
        i++;
        if (l === i) {
          defer.resolve(out);
        }
    });
  });
  return defer.promise;
};

exports.getTags = function (req, res) {
  Tag.find({userId: req.user._id},function (err, tags) {
    if (err) {
      console.log(err);
    }
    else {
      // @TODO ugly !!!
      var promise = getNumber(tags);
      promise.then(function (resTags) {
        res.json(resTags);
      }, function(err) {console.log(err)});
    }
  });
};

// @TODO to model ?
exports.updateTags = function (tags, userId) {
  var i = 0;
  var deferred = Q.defer();
  var l = tags.length;
  var out = [];
  if (l === 0) {
    deferred.resolve(out);
  }
  tags.forEach(function (t){
    // Try to find the tag
    Tag.findOne({userId: userId, text: t.text}, function (err, resTag){
      // @TODO error handling - deferred.reject()
      if (err) {}
      if (resTag) {
        out.push(resTag._id);
        i++;
        // @TODO code duplication
        if (i === l) {
          deferred.resolve(out);
        }
      }
      else {
        var tag = Tag({text: t.text, userId: userId});
        tag.save(function (err, res) {
          out.push(res._id);
          i++;
          if (i === l) {
            deferred.resolve(out);
          }
        });
      }
    });
  });
  return deferred.promise;
};

exports.editTag = function (req, res) {
  Tag.findOne({_id: req.params.id}, function (err, tag) {
    if (err) {
      console.log(err);
    }
    else {
      // @TODO sanitize user's input
      tag.text = req.body.name;
      tag.save(function (saveErr) {
        if (saveErr) {
          if (saveErr.code === 11000) {
            res.status(409).json('Tag name already exists');
          }
        }
        else {
          res.json('tag saved');
        }
      });
    }
  });
};

exports.removeTag = function (req, res) {
  var tagId = req.params.id;
  Tag.remove({_id: tagId}, function (err) {
    // @TODO error handling
    res.json(req.params.id);
  });
  Note.find({'tags': {$in: [tagId]}}, function (err, notes) {
    notes.forEach(function (note) {
      var tagArray = note.tags;
      tagArray.splice(tagArray.indexOf(tagId), 1);
      note.tags = tagArray;
      note.save(function () {
        //res.json(req.params.id);
      });
    });
  });
};

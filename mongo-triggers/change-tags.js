// TO run script from mongo shell:
// load("change-tags.js")
var cursor = db.notes.find();
while (cursor.hasNext()) {
  var x = cursor.next();
  x.tags = [];
  db.notes.update({_id: x._id}, x);
  //for (var i in x.tags) {
    //var el = x.tags[i];
    //var tagName = el.text;
    //var tagUserId = el.userId;
    //var tagCursor = db.tags.find({userId: tagUserId, text: tagName});
    //print(tagCursor[0]);
    //while(tagCursor.hasNext()) {
      //var t = tagCursor.next();
      //print(t);
    //}
    //print(tagName + ' - ' + tagUserId);
  //}
}

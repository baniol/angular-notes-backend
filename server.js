var express = require('express');
var app = express();
var http = require('http');
var server = http.Server(app);
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

// Controllers
var tagController = require('./controllers/tagController.js');
var notesController = require('./controllers/notesController.js');

var mongoUrl = 'localhost';
var mongoPort = '27017';
var mongoDBName = 'my-notes';

mongoose.connect('mongodb://' + mongoUrl + ':' + mongoPort + '/' + mongoDBName);
mongoose.connection.on('error', function (err) {
  console.log(err);
  console.log('Cannot connect to MongoDB');
});

var settings = {
  mongoconnection: 'mongodb://' + mongoUrl + ':' + mongoPort + '/' + mongoDBName,
  logFile: path.join(__dirname, 'authlogger.log'),
  corsDomains: ['http://192.168.33.13:3000'],
  serviceUrlSeparator: '#/',
  tokenExpire: 604800, // one week
  // Nodemailer settings, used for resetting password
  mailer: {
    mailerFrom: '',
    mailerTitle: 'Password reset',
    mailerInfo: '<strong>Click the link to reset your password.</strong>',
    transporter: {
      service: 'Gmail',
      auth: {
        user: '',
        pass: ''
      }
    }
  }
};
var auth = require('express-jwt-auth')(app, settings);

app.use(bodyParser.json());

app.get('/api/notes', auth, notesController.getNotes);
app.get('/api/test', notesController.getTest);
app.post('/api/notes', auth, notesController.postNote);
app.put('/api/notes/:id', auth, notesController.putNote);
app.delete('/api/notes/:id', notesController.deleteNote);
app.post('/api/order', auth, notesController.order);
app.get('/api/tags', auth, tagController.getTags);
app.put('/api/tags/:id', auth, tagController.editTag);
app.delete('/api/tags/:id', auth, tagController.removeTag);

server.listen(3000);

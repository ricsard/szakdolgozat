var express = require('express');
var router = express.Router();
var multer = require('multer');

var multerUp = multer({ dest: './sound/' });
var Sound = require('../models/sound');
var fs = require('fs');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { title: 'Thesis' });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login'), function(req, res) {
    res.json({page: '/home'});
  });

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup'), function(req, res) {
    res.json({page: '/home'});
  });

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user });
  });

  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    //res.redirect('/');
    res.json({page: '/'});
  });

  /* List sounds */
  router.get('/sound', function(req, res) {
    Sound.find({}, function (err, sounds) {
      if (err){
        console.log('Error in querying sound: '+err);
        res.status(500);
        res.send(JSON.stringify({err: err}));
      }
      res.status(200);
      res.send(sounds);
    });
  });

  /* Get one sound by id */
  router.get('/sound/:id', function(req, res) {
    Sound.findOne({_id: req.params.id}, function (err, sound) {
      if (err){
        console.log('Error in querying sound: '+err);
        res.status(500);
        res.send(JSON.stringify({err: err}));
      }
      res.status(200);
      res.send(sound);
    });
  });

  /* Get one sound by id */
  router.get('/sound/file/:id', function(req, res) {

    console.log('GET SOUND');
    console.log(req.params.id);

    Sound.findOne({_id: req.params.id}, function (err, sound) {
      if (err){
        console.log('Error in querying sound: '+err);
        res.status(500);
        res.send(JSON.stringify({err: err}));
      }

      res.sendfile('./sound/' + sound.filename);

      //fs.readFile('./sound/' + sound.filename, function(error, content) {
      //  if (error) {
      //    //res.writeHead(500);
      //    res.status(500);
      //    res.send();
      //  }
      //  else {
      //    //res.writeHead(200, { 'Content-Type': 'audio/mp3' });
      //    res.sendfile(content, 'binary');
      //  }
      //});
      //res.status(200);
      //res.send(sound);
    });
  });

  /* Upload an audio */
  router.post('/sound/upload', multerUp.single('file'), function(req, res, next) {
    console.log("File upload start");
    //console.log(req.file);
    //console.log(req.body);
    //console.log(req.user);

    var data = JSON.parse(req.body.data);

    var sound = new Sound();

    sound.filename = req.file.filename;
    sound.mimetype = req.file.mimetype;
    sound.ownerId = req.user._id;
    sound.name = data.name;

    //console.log('------------');
    //console.log(sound);

    sound.save(function(err) {
      if (err){
        console.log('Error in Saving sound: '+err);
        res.status(500);
        res.send(JSON.stringify({err: err}));
      }
      console.log('Sound save was succesful');
      res.status(200);
      res.send(JSON.stringify(sound));
    });

    console.log("File upload done");
    //res.status(200);
    //res.send(JSON.stringify(sound));
  });

  return router;
};

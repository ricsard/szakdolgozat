var express = require('express');
var router = express.Router();
var multer = require('multer');

var multerUp = multer({ dest: './sound/' });
var Sound = require('../models/sound');
var User = require('../models/user');
var Inspection = require('../models/inspection');
var fs = require('fs');
var bCrypt = require('bcrypt-nodejs');

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
};

var hasPatientLevel = function(req, res, next) {
  if(req.user.role === 'patient' || req.user.role === 'doctor') {
    return next();
  } else {
    res.status(401);
    res.json({error: "Unauthorized for this operation!"})
  }
};

var hasDoctorLevel = function(req, res, next) {
  if(req.user.role === 'doctor') {
    return next();
  } else {
    res.status(401);
    res.json({error: "Unauthorized for this operation!"})
  }
};

var hasResearcherLevel = function(req, res, next) {
  if(req.user.role === 'researcher') {
    return next();
  } else {
    res.status(401);
    res.json({error: "Unauthorized for this operation!"})
  }
};

// Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

function searchUser(req, res, role) {
  if(req.body.search != '' && req.body.search != undefined) {
    if(role != undefined) {
      var searchObj = { role: role, $or:[ {'firstName': new RegExp(req.body.search, "i")}, {'lastName': new RegExp(req.body.search, "i")} ]}
    } else {
      var searchObj ={ $or:[ {'firstName': new RegExp(req.body.search, "i")}, {'lastName': new RegExp(req.body.search, "i")} ]}
    }

    User.find( searchObj,
        function(err,docs){
          if (err){
            console.log('Error in searching user: '+err);
            res.status(500);
            res.send(JSON.stringify({err: err}));
          }
          for(var i = 0; i < docs.length; i++) {
            delete docs[i]._doc.password;
          }
          res.json({result: docs});
        });
  } else {
    res.json({result: []});
  }
}

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { title: 'Thesis' });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login'), function(req, res) {
    res.json({page: '/home', user: req.user});
  });

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup'), function(req, res) {
    res.json({page: '/'});
  });

  /* GET Patient Registration Page */
  router.get('/signup/patient', isAuthenticated, hasDoctorLevel, function(req, res){
    res.render('registerPatient');
  });

  /* Handle Patient Registration POST */
  router.post('/signup/patient', isAuthenticated, hasDoctorLevel, function(req, res) {
    var user = new User(req.body);

    user.password = createHash(user.password);

    User.findOne({ 'username' :  req.body.username }, function(err, prevUser) {
      if (err){
        console.log('Error in add patient: '+err);
        res.status(500);
        res.json({err: err});
      } else if(prevUser) {
        console.log('This username already exists');
        res.status(500);
        res.json({err: 'This username already exists'});
      } else {
        user.save(function(err, savedUser) {
          if (err){
            console.log('Error in add patient: '+err);
            res.status(500);
            res.json({err: err});
          }
          console.log('Patient add was successful');
          res.status(200);
          res.json(savedUser);
        });
      }
    });
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

  /*************************************************
   USER
   *************************************************/
  /* User profile page GET */
  router.get('/user/:id', isAuthenticated, hasDoctorLevel, function(req, res) {
    res.render('profilePage', { userId: req.params.id });
  });

  /* User data GET */
  router.get('/user/data/:id', isAuthenticated, hasDoctorLevel, function(req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
      if (err){
        console.log('Error in querying user: '+err);
        res.status(500);
        res.send(JSON.stringify({err: err}));
      }
      delete user._doc.password;
      res.status(200);
      res.send(user);
    });
  });

  /*************************************************
   SEARCH
  *************************************************/
  /* Search user GET */
  router.get('/search/user', isAuthenticated, function(req, res) {
    res.render('searchUser');
  });

  /* Search user POST */
  router.post('/search/user', isAuthenticated, hasDoctorLevel, function(req, res) {
    searchUser(req, res);
  });

  /* Search patient POST */
  router.post('/search/patient', isAuthenticated, hasDoctorLevel, function(req, res) {
    searchUser(req, res, 'patient');
  });

  /* Search doctor POST */
  router.post('/search/doctor', isAuthenticated, hasPatientLevel, function(req, res) {
    searchUser(req, res, 'doctor');
  });

  /* Search researcher POST */
  router.post('/search/researcher', isAuthenticated, hasDoctorLevel, function(req, res) {
    searchUser(req, res, 'researcher');
  });

  /*************************************************
   INSPECTION
   *************************************************/
  /* Add inspection for a user POST */
  router.post('/inspection/add', isAuthenticated, hasDoctorLevel, function(req, res) {
    var inspection = new Inspection(req.body);
    inspection.doctors.push(req.user._id);

    inspection.save(function(err, savedInspection) {
      if (err){
        console.log('Error in add inspection: '+err);
        res.status(500);
        res.json({err: err});
      }
      console.log('Inspection add was successful');
      res.status(200);
      res.json(savedInspection);
    });
  });

  /* List inspections for a user GET */
  router.get('/inspection/list/:userId', isAuthenticated, hasDoctorLevel, function(req, res) {
    Inspection.find({ userId: req.params.userId }, function(err, inspections) {
      if (err){
        console.log('Error in list inspections: '+err);
        res.status(500);
        res.json({err: err});
      }
      console.log('Inspections list was successful');
      res.status(200);
      res.json({results: inspections});
    });
  });


  /*************************************************
   SOUND
   *************************************************/
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
      console.log('Sound save was successful');
      res.status(200);
      res.send(JSON.stringify(sound));
    });

    console.log("File upload done");
    //res.status(200);
    //res.send(JSON.stringify(sound));
  });

  return router;
};

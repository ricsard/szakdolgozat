var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');

var mime = require('mime');
var shortid = require('shortid');

var soundStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './sound/')
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '.' + mime.extension(file.mimetype));
  }
});
var multerUp = multer({ storage: soundStorage });

var attStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './attachments/')
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '.' + mime.extension(file.mimetype));
  }
});
var attachmentUpload = multer({ storage: attStorage });

var Sound = require('../models/sound');
var User = require('../models/user');
var Inspection = require('../models/inspection');
var Attachment = require('../models/attachment');

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

/**
 * Send unauthorized message
 * @param req
 * @param res
 */
var sendUnauthorized = function(req, res) {
  res.status(401);
  res.json({error: "Unauthorized for this operation!"})
};

/**
 * Send the err back as an error message
 * @param req
 * @param res
 * @param msg
 * @param err
 */
var sendError = function(req, res, msg, err) {
  console.log(msg + ': '+err);
  res.status(500);
  res.json({err: err});
};

// Generates hash using bCrypt
var createHash = function(password){
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

function searchUser(req, res, role) {
  if(req.body.search != '' && req.body.search != undefined) {
    var searchObj = {};
    if(role != undefined) {
      searchObj = { role: role, $or:[ {'firstName': new RegExp(req.body.search, "i")}, {'lastName': new RegExp(req.body.search, "i")} ]}
    } else {
      searchObj ={ $or:[ {'firstName': new RegExp(req.body.search, "i")}, {'lastName': new RegExp(req.body.search, "i")} ]}
    }

    User.find( searchObj, function(err,docs){
      if (err){
        sendError(req, res, 'Error in searching user', err);
      } else {
        for(var i = 0; i < docs.length; i++) {
          delete docs[i]._doc.password;
        }
        res.json({result: docs});
      }
    });
  } else {
    res.json({result: []});
  }
}

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
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
            sendError(req, res, 'Error in add patient', err);
          } else {
            console.log('Patient add was successful');
            res.status(200);
            res.json(savedUser);
          }
        });
      }
    });
  });

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    res.render('home', { user: req.user, soundId: '564c6511b463e2cc225fa08c' });
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
  router.get('/user/:id', isAuthenticated, function(req, res) {
    res.render('profilePage', { userId: req.params.id, signedInUser: req.user });
  });

  /* User data GET */
  router.get('/user/data/:id', isAuthenticated, function(req, res) {
    User.findOne({_id: req.params.id}, function (err, user) {
      if (err){
        sendError(req, res, 'Error in querying user', err);
      } else {
        delete user._doc.password;
        res.status(200);
        res.send(user);
      }
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
        sendError(req, res, 'Error in add inspection', err);
      } else {
        console.log('Inspection add was successful');
        res.status(200);
        res.json(savedInspection);
      }
    });
  });

  /* List inspections for a user GET */
  router.get('/inspection/list/:userId', isAuthenticated, function(req, res) {
    if(req.user.role === 'patient' && req.user._id != req.params.userId) {
      sendUnauthorized(req, res);
    }
    Inspection.find({ userId: req.params.userId }, function(err, inspections) {
      if (err){
        sendError(req, res, 'Error in list inspections', err);
      } else {
        console.log('Inspections list was successful');
        res.status(200);
        res.json({results: inspections});
      }
    });
  });

  /* Get inspection by id GET */
  router.get('/inspection/:id', isAuthenticated, function(req, res) {
    Inspection.findOne({ _id: req.params.id }, function(err, inspection) {
      if (err){
        sendError(req, res, 'Error in get inspections', err);
      } else {
        console.log('Inspections get was successful');

        Sound.find({ _id: { $in: inspection.sounds } }, function(err, sounds) {
          if (err){
            sendError(req, res, 'Error in get inspections', err);
          } else {
            res.status(200);
            res.render('inspectionPage', { inspectionId: req.params.id, sounds: sounds, signedInUser: req.user })
          }
        });
      }
    });
  });

  /* Get inspection data by id GET */
  router.get('/inspection/data/:id', isAuthenticated, function(req, res) {
    //if(req.user.role === 'patient' && req.user._id != req.params.userId) {
    //  sendUnauthorized(req, res);
    //} else {
      Inspection.findOne({ _id: req.params.id }, function(err, inspection) {
        if (err){
          sendError(req, res, 'Error in get inspection', err);
        } else {
          console.log('Inspection get was successful');
          res.status(200);
          res.json(inspection);
        }
      });
    //}
  });

  /* Update inspection by id POST */
  router.post('/inspection/update/:id', isAuthenticated, function(req, res) {
    //if(req.user.role === 'patient' && req.user._id != req.params.userId) {
    //  sendUnauthorized(req, res);
    //}
    Inspection.findOneAndUpdate({ _id: req.params.id }, req.body, function(err, updInspection) {
      if (err){
        sendError(req, res, 'Error in update inspection', err);
      } else {
        console.log('Inspection update was successful');
        res.status(200);
        res.json(updInspection);
      }
    });
  });

  /*************************************************
   MYPATIENTS
   *************************************************/
  /* Get myPatients page GET */
  router.get('/myPatients', isAuthenticated, hasDoctorLevel, function(req, res) {
    res.render('myPatients');
  });

  /* List myPatients as a doctor GET */
  router.get('/myPatients/list', isAuthenticated, hasDoctorLevel, function(req, res) {
    User.find({ doctors: req.user._id }, function(err, patients) {
      if (err){
        sendError(req, res, 'Error in list myPatients', err);
      } else {
        console.log('MyPatients list was successful');
        res.status(200);
        res.json({results: patients});
      }
    });
  });

  /*************************************************
   SOUND
   *************************************************/
  /* Upload a sound POST */
  router.post('/sound/upload', isAuthenticated, multerUp.single('file'), function(req, res, next) {
    var data = JSON.parse(req.body.data);
    var sound = new Sound();

    sound.filename = req.file.filename;
    sound.mimetype = req.file.mimetype;
    sound.ownerId = req.user._id;
    sound.name = data.name;

    sound.save(function(err) {
      if (err){
        sendError(req, res, 'Error in Saving sound', err);
      } else {
        console.log('Sound save was successful');
        res.status(200);
        res.json(sound);
      }
    });
  });

  /* Get sounds list page GET */
  router.get('/sounds', isAuthenticated, function(req, res) {
    Sound.find({}, function (err, sounds) {
      if (err){
        sendError(req, res, 'Error in querying sound', err);
      } else {
        res.render('soundsList', {sounds: sounds});
      }
    });
  });

  /* List sounds GET */
  router.get('/sound/list', isAuthenticated, function(req, res) {
    Sound.find({}, function (err, sounds) {
      if (err){
        sendError(req, res, 'Error in querying sound', err);
      } else {
        res.status(200);
        res.json(sounds);
      }
    });
  });

  /* Get one sound metadata by id GET */
  router.get('/sound/:id', isAuthenticated, function(req, res) {
    Sound.findOne({_id: req.params.id}, function (err, sound) {
      if (err){
        sendError(req, res, 'Error in querying sound', err);
      } else {
        res.status(200);
        res.send(sound);
      }
    });
  });

  /* Get one soundFile by id GET */
  router.get('/sound/file/:id', isAuthenticated, function(req, res) {
    Sound.findOne({_id: req.params.id}, function (err, sound) {
      if (err){
        sendError(req, res, 'Error in querying sound', err);
      } else {
        res.sendFile(path.join(__dirname, '../sound', sound.filename));
      }
    });
  });

  /* Delete a sound by id DELETE */
  router.delete('/sound/delete/:id', isAuthenticated, function(req, res, next) {
    Sound.findOneAndRemove({ _id: req.params.id }, function(err, sound) {
      if (err){
        sendError(req, res, 'Error in removing sound', err);
      } else {
        fs.unlinkSync('./sound/' + sound.filename);
        console.log('Sound remove was successful');
        res.status(200);
        res.json({status: 'OK'});
      }
    });
  });

  /*************************************************
   ATTACHMENT
   *************************************************/
  /* Upload an attachment POST */
  router.post('/attachment/upload', isAuthenticated, attachmentUpload.single('file'), function(req, res, next) {
    var data = JSON.parse(req.body.data);
    var attachment = new Attachment();

    attachment.filename = req.file.filename;
    attachment.mimetype = req.file.mimetype;
    attachment.ownerId = req.user._id;
    attachment.name = data.name;

    attachment.save(function(err, savedAttachment) {
      if (err){
        sendError(req, res, 'Error in Saving attachment', err);
      } else {
        console.log('Attachment save was successful');
        res.status(200);
        res.json(savedAttachment);
      }
    });
  });

  /* Get one attachment metadata by id GET */
  router.get('/attachment/:id', isAuthenticated, function(req, res) {
    Attachment.findOne({_id: req.params.id}, function (err, attachment) {
      if (err){
        sendError(req, res, 'Error in querying attachment', err);
      } else {
        res.status(200);
        res.send(attachment);
      }
    });
  });

  /* Get one attachmentFile by id GET */
  router.get('/attachment/file/:id', isAuthenticated, function(req, res) {
    Attachment.findOne({_id: req.params.id}, function (err, attachment) {
      if (err){
        sendError(req, res, 'Error in getting attachment', err);
      } else {
        res.sendFile(path.join(__dirname, '../attachments', attachment.filename));
      }
    });
  });

  /* Delete an attachment by id DELETE */
  router.delete('/attachment/delete/:id', isAuthenticated, function(req, res, next) {
    Attachment.findOneAndRemove({ _id: req.params.id }, function(err, attachment) {
      if (err){
        sendError(req, res, 'Error in removing attachment', err);
      } else {
        fs.unlinkSync('./attachments/' + attachment.filename);
        console.log('Attachment remove was successful');
        res.status(200);
        res.json({status: 'OK'});
      }
    });
  });

  return router;
};

/**
 * Created by Ricsard on 2015. 10. 31..
 */
var express = require('express');
var multer = require('multer');
var router = express.Router();

var multerUp = multer({ dest: './upload/' });

/* GET users listing. */
router.post('/', multerUp.single('file'), function(req, res, next) {
    console.log("File upload start");
    console.log(req.file);
    console.log(req.body);

    console.log("File upload done");
    res.write(JSON.stringify({msg: 'File upload done'}));
});

module.exports = router;

/**
 * Created by Ricsard on 2015. 11. 02..
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    firstName: String,
    lastName: String,
    username: String,
    password: String,
    gender: String,
    role: String,
    doctors: [String]
});
/**
 * Created by Ricsard on 2015. 11. 02..
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Attachment',{
    mimetype: String,
    filename: String,
    name: String,
    ownerId: String
});
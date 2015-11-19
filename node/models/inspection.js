/**
 * Created by Ricsard on 2015. 11. 02..
 */
var mongoose = require('mongoose');

module.exports = mongoose.model('Inspection',{
    userId: String,
    name: String,
    diagnosis: String,
    treatment: String,
    comment: String,
    sounds: [String],
    attachments: [String],
    doctors: [String],
    date: Date
});
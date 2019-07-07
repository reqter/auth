
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Schema definitions.
 */

 const partner = new Schema({
    spaceId : {type: Schema.Types.ObjectId, ref: 'Space'},
    first_name : {type : String, required : true, max : 150},
    last_name : {type : String},
    phoneNumber : {type : String},
    email : {type : String},
    phoneNumberVerified : {type : Boolean},
    emailVerified : {type : Boolean},
    address : {type : Object},
    notification : {type : Boolean},
    location : {type : Object},
    avatar : {type : Object},
    homepage : {type : String},
    favorites : [Object],
    company : {type : Object},
    rate : {type:Number},
    rules : [Object]
});

module.exports = mongoose.model('Partner', partner);
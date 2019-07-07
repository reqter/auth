
/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/**
 * Schema definitions.
 */

 const customer = new Schema({
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
    birth_info : {type : Object},
    favorites : [Object]
});

module.exports = mongoose.model('Customer', customer);
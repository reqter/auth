var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const SALT_WORK_FACTOR = 10;

var user = new Schema({
    username : {type:String, required : true},
    password : {type:String, required : true},
    activation_code : {type:Number},
    approved : {type : Boolean},
    active : {type : Boolean, default : true},
    role : {type:String, default : "customer"},
    language : {type : String},
    notification : {type:Boolean},
    access_token : {type:String},
    device : {type:String},
    lastlogin : {type : Date},
    spaceId : {type: Schema.Types.ObjectId, ref: 'Space'},
    contact : {type: Schema.Types.ObjectId, ref: 'Contact'}
}, { toJSON: { virtuals: true } });

user.pre('save', function(next) {
    var sh = this;
    // only hash the password if it has been modified (or is new)
    if (!sh.isModified('password')) return next();
    if (!sh.password) return next();
    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(sh.password, salt, function(){}, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            sh.password = hash;
            next();
        });
    });
});

user.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


user.methods.comparePasswordSync = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};
user.
virtual('name').
get(function(){
    return this.first_name + ' ' + this.last_name;
});
module.exports = mongoose.model("Users", user);

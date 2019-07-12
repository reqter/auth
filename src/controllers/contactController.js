const Contacts = require('../models/contact');
var findByUSpaceId = function(req, cb)
{
    console.log(req);
    Contacts.find({"spaceId" : req.spaceId}).exec(function(err, contacts){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (contacts)
        {
            result.success = true;
            result.error = undefined;
            result.data =  contacts;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};
var findById = function(req, cb)
{
    Contacts.find({"id" : req.body.id}).exec(function(err, contact){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (contact)
        {
            if (contact.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            result.success = true;
            result.error = undefined;
            result.data =  contact;
            cb(result); 
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result); 
        }
    });
};
var addcontact= function(req, cb)
{
    var contact = new Contacts();
    contact = Object.assign(contact, req.body);
    contact.sys.type = "contact";
    contact.sys.link = uniqid();
    contact.sys.issuer = req.userId;
    contact.sys.issueDate = new Date();
    contact.sys.spaceId = req.spaceId;
    contact.save(function(err){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        //Successfull. 
        //Publish user registered event
        result.success = true;
        result.error = undefined;
        result.data =  contact;
        cb(result); 
    });
};

var deletecontact= function(req, cb)
{
     Contacts.findById(req.body.id).exec(function(err, contact){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (contact)
        {
            if (contact.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            Contacts.remove({_id : contact._id}, function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                //Successfull. 
                //Publish user account deleted event
                result.success = true;
                result.data =  {"message" : "Deleted successfully"};
                result.error = undefined;
                cb(result);       
                return; 
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};

var updatecontact= function(req, cb)
{
     Contacts.findById(req.body.id).exec(function(err, contact){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (contact)
        {
            if (contact.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            contact = Object.assign(contact, req.body);
            contact.save(function(err){
                if(err)
                {
                    result.success = false;
                    result.data =  undefined;
                    result.error = err;
                    cb(result);       
                    return; 
                }
                //Successfull. 
                //Publish user profile updated event
                Contacts.findById(req.body.id).exec(function(err, contact){
                    if(err)
                    {
                        result.success = false;
                        result.data =  undefined;
                        result.error = err;
                        cb(result);       
                        return; 
                    }
                    result.success = true;
                    result.error = undefined;
                    result.data =  contact;
                    cb(result); 
                });
            });
            return;
        }
        else
        {
            result.success = false;
            result.data =  undefined;
            result.error = undefined;
            cb(result);       
            return; 
        }
    });
};

exports.getall = findByUSpaceId;
exports.add = addcontact;
exports.delete = deletecontact;
exports.update = updatecontact;
exports.findbyid = findById;
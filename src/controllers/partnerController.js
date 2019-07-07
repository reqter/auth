const Partners = require('../models/partner');
var uuid = require('uuid/v4')
var findByUSpaceId = function(req, cb)
{
    console.log(req);
    Partners.find({"spaceId" : req.spaceId}).exec(function(err, partners){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (partners)
        {
            result.success = true;
            result.error = undefined;
            result.data =  partners;
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
    Partners.find({"id" : req.body.id}).exec(function(err, partner){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (partner)
        {
            if (partner.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            result.success = true;
            result.error = undefined;
            result.data =  partner;
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
var addPartner = function(req, cb)
{
    var partner = new Partners({
        spaceId : req.body.spaceId,
        first_name : req.body.first_name,
        last_name : req.body.last_name,
        phoneNumber : req.body.phoneNumber,
        email : req.body.email,
        phoneNumberVerified : req.body.phoneNumberVerified,
        emailVerified : req.body.emailVerified,
        address : req.body.address,
        notification : req.body.notification,
        location : req.body.location,
        avatar : req.body.avatar,
        homepage : req.body.homepage,
        favorites : [],
        company : {},
        rate : 1,
        rules : []
    });
    partner.save(function(err){
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
        result.data =  partner;
        cb(result); 
    });
};

var deletePartner = function(req, cb)
{
     Partners.findById(req.body.id).exec(function(err, partner){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (partner)
        {
            if (partner.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            Partners.remove({_id : partner._id}, function(err){
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

var updatePartner = function(req, cb)
{
     Partners.findById(req.body.id).exec(function(err, partner){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (partner)
        {
            if (partner.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            partner.first_name = req.body.first_name,
            partner.last_name = req.body.last_name,
            partner.phoneNumber = req.body.phoneNumber,
            partner.email = req.body.email,
            partner.phoneNumberVerified = req.body.phoneNumberVerified,
            partner.emailVerified = req.body.emailVerified,
            partner.address = req.body.address,
            partner.notification = req.body.notification,
            partner.location = req.body.location,
            partner.avatar = req.body.avatar,
            partner.homepage = req.body.homepage,
            partner.favorites = req.body.favorites,
            partner.company = req.body.company,
            partner.rate = req.body.rate,
            partner.rules = req.body.rules;
            partner.save(function(err){
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
                Partners.findById(req.body.id).exec(function(err, partner){
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
                    result.data =  partner;
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

exports.findBySpaceId = findByUSpaceId;
exports.addPartner = addPartner;
exports.deletePartner = deletePartner;
exports.updatePartner = updatePartner;
exports.findbyid = findById;
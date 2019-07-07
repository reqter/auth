const Customers = require('../models/customer');
var uuid = require('uuid/v4')
var findByUSpaceId = function(req, cb)
{
    console.log(req);
    Customers.find({"spaceId" : req.spaceId}).exec(function(err, customers){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (customers)
        {
            result.success = true;
            result.error = undefined;
            result.data =  customers;
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
    Customers.find({"id" : req.body.id}).exec(function(err, customer){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (customer)
        {
            if (customer.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            result.success = true;
            result.error = undefined;
            result.data =  customer;
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
var addCustomer= function(req, cb)
{
    var customer = new Customers({
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
        birth_info : req.body.birth_info,
        favorites : []
    });
    customer.save(function(err){
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
        result.data =  customer;
        cb(result); 
    });
};

var deleteCustomer= function(req, cb)
{
     Customers.findById(req.body.id).exec(function(err, customer){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (customer)
        {
            if (customer.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            Customers.remove({_id : customer._id}, function(err){
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

var updateCustomer= function(req, cb)
{
     Customers.findById(req.body.id).exec(function(err, customer){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (customer)
        {
            if (customer.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            customer.first_name = req.body.first_name,
            customer.last_name = req.body.last_name,
            customer.phoneNumber = req.body.phoneNumber,
            customer.email = req.body.email,
            customer.phoneNumberVerified = req.body.phoneNumberVerified,
            customer.emailVerified = req.body.emailVerified,
            customer.address = req.body.address,
            customer.notification = req.body.notification,
            customer.location = req.body.location,
            customer.avatar = req.body.avatar,
            customer.birth_info = req.body.birth_info,
            customer.favorites = req.body.favorites,
            customer.save(function(err){
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
                Customers.findById(req.body.id).exec(function(err, customer){
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
                    result.data =  customer;
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
exports.addCustomer= addPartner;
exports.deleteCustomer= deletePartner;
exports.updateCustomer= updatePartner;
exports.findbyid = findById;
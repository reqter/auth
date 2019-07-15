const Companies = require('../models/company');
var uniqid = require('uniqid')
var findByUSpaceId = function(req, cb)
{
    console.log(req);
    Companies.find({"spaceId" : req.spaceId}).exec(function(err, Companies){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (Companies)
        {
            result.success = true;
            result.error = undefined;
            result.data =  Companies;
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
    Companies.find({"id" : req.body.id}).exec(function(err, company){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (company)
        {
            if (company.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            result.success = true;
            result.error = undefined;
            result.data =  company;
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
//#region  deleted
// {
//     sys : {},
//     first_name : req.body.first_name,
//     last_name : req.body.last_name,
//     phoneNumber : req.body.phoneNumber,
//     email : req.body.email,
//     phoneNumberVerified : req.body.phoneNumberVerified,
//     emailVerified : req.body.emailVerified,
//     address : req.body.address,
//     notification : req.body.notification,
//     location : req.body.location,
//     avatar : req.body.avatar,
//     homepage : req.body.homepage,
//     orgNumber : req.body.orgNumber,
//     country : req.body.country,
//     city : req.body.city,
//     reqistrationNo : req.body.reqistrationNo,
//     numberOfEmployees : req.body.numberOfEmployees,
//     fax : req.body.fax,
//     industryName : req.body.industryName,
//     industryCode : req.body.industryCode,
//     postalCode : req.body.postalCode,
//     address : req.body.address,
//     logo : req.body.logo,
//     relationType : req.body.relationType,
//     owner : req.body.owner,
//     companyStatus : req.body.companyStatus,
//     blacklisted : req.body.blacklisted,
//     companyType : req.body.companyType,
//     companyTypeName : req.body.companyTypeName,
//     creationDocument : req.body.creationDocument,
//     latestBalanceSheet : req.body.latestBalanceSheet,
//     latestBankAccountReport : req.body.latestBankAccountReport,
//     latestChanges : req.body.latestChanges,
//     totalAssets : req.body.totalAssets,
//     total_Equity : req.body.total_Equity,
//     annual_revenue : req.body.annual_revenue,
//     net_margin : req.body.net_margin,
//     turnover : req.body.turnover,
//     signatory_rights : req.body.signatory_rights,
//     boardMembers : req.body.boardMembers,
//     ceo : req.body.ceo,
//     description : req.body.description,
//     cash_liquidity : req.body.cash_liquidity,
//     favorites : [],
//     company : {},
//     rate : 1,
//     rules : []
// }
//
var addcompany = function(req, cb)
{
    console.log("add company controller : " + JSON.stringify(req.body));
    var company = new Companies();
    company = Object.assign(company, req.body);
    company.sys.type = "company";
    company.sys.link = uniqid();
    company.sys.issuer = req.userId;
    company.sys.issueDate = new Date();
    company.sys.spaceId = req.spaceId;
    company.save(function(err){
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
        result.data =  company;
        cb(result); 
    });
};

var deletecompany = function(req, cb)
{
     Companies.findById(req.body.id).exec(function(err, company){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (company)
        {
            if (company.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            Companies.remove({_id : company._id}, function(err){
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

var updatecompany = function(req, cb)
{
     Companies.findById(req.body.id).exec(function(err, company){
        var result = {success : false, data : null, error : null };
        if (err)
        {
            result.success = false;
            result.data =  undefined;
            result.error = err;
            cb(result);       
            return; 
        }
        if (company)
        {
            if (company.owner !== req.userId)
            {
                result.success = false;
                result.data =  {"message" : "Invalid access"};
                result.error = undefined;
                cb(result);       
                return; 
            }
            company = Object.assign(company, req.body);
            company.save(function(err){
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
                Companies.findById(req.body.id).exec(function(err, company){
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
                    result.data =  company;
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
exports.add = addcompany;
exports.delete = deletecompany;
exports.update = updatecompany;
exports.findbyid = findById;
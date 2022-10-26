const HttpStatus = require('http-status');
const AccountService = require('../services/account-service');
const AccountUtils = require('../util/account-utils');
require('dotenv').config();
const { REACT_APP_RESTAPI_IP } = process.env;

exports.updateAccount = async (req, res, next) => {
    console.log('updateAccount');
    console.log(req.body.memberInfo);
    const memberInfo = req.body.memberInfo;

    await AccountService.updateAccount(memberInfo)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully memberInfo!!',
                results: results
            });

        })
        .catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });

}

exports.updateEmail = async (req, res, next) => {   
    console.log('updateEmail');
    console.log(req.body.emailInfo);
    const emailInfo = req.body.emailInfo;

    await AccountService.updateEmail(emailInfo)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully updateEmail!!',
                results: results
            });

        })
        .catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });
}


exports.authNumberSend = async (req, res, next) => {
    console.log('authNumberSend');
    console.log(req.body.authNumberData);
    const sendMailInfo = req.body.authNumberData;
    await AccountService.authNumberSend(sendMailInfo)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully authNumberSend!!',
                results: results
            });

        })
        .catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });
}

exports.searchAccounts = async (req, res, next) => {
    
    const searchInfo = {
        condition: { condition },
        value : { value }
    } = req.query;

    await AccountService.searchAccounts(searchInfo)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully searchAccounts!!',
            results: results
        });

    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });

    });
   
}

exports.selectAccounts = async (req, res, next) => {

    await AccountService.selectAccounts()
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully selectAccounts!!',
                results: results
            });

        })
        .catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });
};

exports.selectAccount = async (req, res, next) => {

    await AccountService.selectAccountWithMemberCode(req.query.code)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully selectAccount!!',
                results: results
            });

        })
        .catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });
}

exports.emailAuth = async (req, res, next) => {
    
    console.log(req.query);

    await AccountService.emailAuthWithToken(req.query)
    .then((result) => {

        res.redirect(`http://${process.env.REACT_APP_RESTAPI_IP}/`);
        
    })
    .catch((err) =>{
        console.log(err);
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });

    });

}

exports.registerAccount = async (req, res, next) => {

    console.log(req.body.data);

    await AccountService.registerAccount(req.body.data)
        .then((result) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully register Account!!',
                results: result
            });

        })
        .catch((err, result) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err,
                results: result
            });

        });
};

exports.loginAccount = async (req, res, next) => {
    console.log('loginAccount called');

    await AccountService.loginAccount(req.body)
        .then((resData) => {
            
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully Login!!',
                accessToken: resData.token,
                result: resData.account
            });

        })
        .catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });

};

exports.searchID = async (req, res, next) => {

    console.log('searchID called');
    const email = req.query.email;
    await AccountService.selectAccountAndSendEmail(email)
        .then((resData) => {
            console.log(resData);
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully Search ID!!',
                result: resData
            });

        })
        .catch((err) =>{
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });

};

exports.updateTempPwd = async (req, res, next) => {

    console.log('updateTempPwd called');
    console.log(req.query);
    const memberInfo = req.query;
    await AccountService.updateAccountWithTempPwd(memberInfo)
        .then((resData) => {
            console.log(resData);
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully Update PWD!!'
            });

        })
        .catch((err) =>{
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });   
}

exports.updatePwd = async (req, res, next) => {
    console.log('updatePwd called');    
    const pwInfo = req.body.pwdUpdateData;
    
    await AccountService.updateAccountWithPwd(pwInfo)
        .then((resData) => {
            console.log(resData);
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully Update PWD!!'
            });

        })
        .catch((err) =>{
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });   
}

exports.memberHistory = async (req, res, next) => {

    console.log(req.params);

    const memberCode = req.params.membercode;

    await AccountService.getMemberHistory(memberCode)
        .then((resData) => {
            console.log(resData);
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully History!!',
                result: resData
            });

        })
        .catch((err) =>{
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });
}
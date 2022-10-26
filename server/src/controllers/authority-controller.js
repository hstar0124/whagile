const HttpStatus = require('http-status');
const AuthorityService = require('../services/authority-service');

exports.editAuthOrder = async (req, res, next) => {
    console.log('editAuthOrder...');
    await AuthorityService.editAuthOrder(req.body)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully edit authority order',
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

exports.getAuthHistory = async (req, res, next) => {
    console.log('getAuthHistory...');
    await AuthorityService.getAuthHistory(req.query)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully get authority history',
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

exports.addAuth = async (req, res, next) => {
    console.log('addAuth...');
    await AuthorityService.addAuth(req.body)
    .then((results) => {
        
        res.status(HttpStatus.OK).json({
            status: HttpStatus.CREATED,
            message: 'successfully add authority',
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

exports.viewAuths = async (req, res, next) => {
    console.log('viewAuths...');
    await AuthorityService.viewAuths(req.query)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully view authorities',
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

exports.viewAuth = async (req, res, next) => {
    console.log('viewAuth...');
    await AuthorityService.viewAuth(req.params.authorityCode)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully view authority',
            results: results
        });
    })
    .catch((err) => {
        
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    })
}

exports.editAuth = async (req, res, next) => {
    console.log('editAuth...');
    await AuthorityService.editAuth(req.body)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully edit authority',
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

const utils = require('../util/account-utils');

exports.deleteAuth = async (req, res, next) => {
    console.log('deleteAuth...');
    await AuthorityService.deleteAuth(req.body.authorityCode)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully delete authority',
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
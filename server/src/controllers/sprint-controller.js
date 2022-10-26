const HttpStatus = require('http-status');
const SprintService = require('../services/sprint-service');

exports.addSprint = async (req, res, next) => {
    console.log('addSprint...');
    await SprintService.addSprint(req.body)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.CREATED,
            message: 'successfully add sprint',
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

exports.viewSprints = async (req, res, next) => {
    console.log('viewSprints...');
    await SprintService.viewSprints(req.query)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully view sprints',
            results: results,
        });
    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    });
}

exports.viewSprintHistory = async (req, res, next) => {
    console.log('viewSprintHistory...');
    await SprintService.viewSprintHistory(req.query)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully view sprint history',
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

exports.viewSprint = async (req, res, next) => {
    console.log('viewSprint...');
    await SprintService.viewSprint(req.params.sprintCode)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: 'successfully view sprint',
            results: results[0]
        });
    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    });
}

exports.editSprint = async (req, res, next) => {
    console.log('editSprint...');
    await SprintService.editSprint(req.body)
    .then((results) => {

        res.status(HttpStatus.OK).json({ 
            status: HttpStatus.OK,
            message: 'successfully update sprint',
            results: results
        })
    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    });
}

exports.deleteSprint = async (req, res, next) => {
    console.log('deleteSprint...');
    await SprintService.deleteSprint(req.body)
    .then((results) => {

        res.status(HttpStatus.OK).json({ 
            status: HttpStatus.OK,
            message: 'successfully delete sprint',
            results: results
        })
    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    });
}

exports.viewSprintsCount = async (req, res, next) => {
    console.log('viewSprintsCount...');
    await SprintService.viewSprintsCount(req.query)
    .then((results) => {

        res.status(HttpStatus.OK).json({ 
            status: HttpStatus.OK,
            message: 'successfully view sprints count',
            results: results
        })
    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    });
}

exports.editSprintProgress = async (req, res, next) => {
    console.log('editSprintProgress...');
    await SprintService.editSprintProgress(req.body)
    .then((results) => {

        res.status(HttpStatus.OK).json({ 
            status: HttpStatus.OK,
            message: 'successfully edit sprint progress',
            results: results
        })
    })
    .catch((err) =>{

        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    });
}
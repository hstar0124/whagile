const HttpStatus = require('http-status');
const AdminStatisticService = require('../services/admin-statistics-service');

exports.viewCounts = async (req, res, next) => {
    console.log('viewCounts...');
    await AdminStatisticService.viewCounts()
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.CREATED,
            message: 'successfully view admin dashboard counts',
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

exports.viewChartCounts = async (req, res, next) => {
    console.log('viewChartCounts...');
    await AdminStatisticService.viewChartCounts(req.query)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.CREATED,
            message: 'successfully view admin dashboard chart counts',
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
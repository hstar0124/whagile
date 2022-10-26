const HttpStatus = require('http-status');

exports.test = (req, res, next) => {

    console.log('test api call');

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'successfully test!!'        
    });
     
};
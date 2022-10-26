const jwt = require('jsonwebtoken');
const AccountUtils = require('../util/account-utils')
require('dotenv').config();
const { JWT_SECRET } = process.env;

const verifyToken = (req, res, next) => {
   
    const token = req.header('Access_token');

    console.log('verify_token', token);

    if(!token) {
        return res.status(401).json({
            message: "No token provided!"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decodedInfo) => {
        if (err) {
            return res.status(401).json({
                message: "Unauthorized!"
            });
        }     
        
        next();
    });      
}


const authJwt = {
    verifyToken
};

module.exports = authJwt;
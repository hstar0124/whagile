const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const generator = require('generate-password');

exports.setPassword = (password) => {
    console.log('setPassword called');
    
    return bcrypt.hash(password, 10);;
}

exports.checkPassword = (password, passwordHash) => {
    return bcrypt.compare(password, passwordHash);
}

exports.generateTempPassword = () => {
    return new Promise((resolve, reject) => {
        
        resolve(generator.generate({
            length: 10,
            lowercase: true,
            uppercase: true,
            numbers: true
        }))
    });
}

exports.generateToken = (memberCode, memberId, memberName, memberEmail, role) => {
    return new Promise((resolve, reject) => {

        jwt.sign(
            {
                code: memberCode,
                id: memberId,
                username: memberName,
                email: memberEmail,
                role: role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '48h'
            },
            (err, token) => {
                if(err) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('generated token', token);
                    resolve(token);
                }
            }
        );    
    });
}

exports.decodedToken = (token) => {

    const result = jwt.verify(token, JWT_SECRET);

    const decodedToken = {
        usercode: result.code,
        id: result.id,
        username: result.username,
        email: result.email,
        role: result.role
    };
    

    return decodedToken;
};
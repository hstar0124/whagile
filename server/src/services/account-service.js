const getConnection = require('../database/connection');
const AccountRepository = require('../repositories/account-repo');
const AccountUtils = require('../util/account-utils');
const EmailUtils = require('../util/email-utils');
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");
const { JWT_SECRET } = process.env;

exports.updateAccount = (memberInfo) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        console.log('updateAccount', memberInfo);

        const results = await AccountRepository.updateAccount(connection, memberInfo);
        
        if(results.length < 1) {
            console.log('정보 변경 실패');
            return reject('정보 변경 실패');
        }

        connection.end();

        resolve(results);
    });
}

exports.searchAccounts = (searchInfo) => {
    
    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        console.log('searchAccounts', searchInfo);

        const results = await AccountRepository.searchAccounts(connection, searchInfo);
        
        if(results.length < 1) {
            console.log('조회되지 않음');
            return reject('조회되지 않음');
        }

        connection.end();

        resolve(results);
    });
}

exports.updateEmail = (emailInfo) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        console.log('updateEmail', emailInfo);

        const results = await AccountRepository.updateEmail(connection, emailInfo);
        
        if(results.length < 1) {
            console.log('이메일 변경 실패');
            return reject('이메일 변경 실패');
        }

        connection.end();

        resolve(results);
    });
}

exports.authNumberSend = (sendMailInfo) => {
    
    return new Promise(async (resolve, reject) => {
        
        console.log('authNumberSend', sendMailInfo);

        await EmailUtils.sendAuthNumberMail(sendMailInfo);

        resolve(sendMailInfo);
    });
}

exports.updateAccountWithPwd = (pwInfo) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        const userInfo = await AccountRepository.selectAccountWithMemberCode(connection, pwInfo.memberCode);
        console.log('userInfo', userInfo);

        const originPasswordByte = CryptoJS.AES.decrypt(pwInfo.originPassword , process.env.REACT_APP_KEY);
        const originPasswordDecrypted = originPasswordByte.toString(CryptoJS.enc.Utf8);
        console.log('originPasswordDecrypted', originPasswordDecrypted);
  
        const passwordCompareResult = await AccountUtils.checkPassword(originPasswordDecrypted, userInfo[0].password);
        console.log('passwordCompareResult',passwordCompareResult);

        if(!passwordCompareResult){
            // 패스워드 불일치
            console.log('Invalid password');
            return reject("Invalid password");
        } 

        const passwordByte = CryptoJS.AES.decrypt(pwInfo.password , process.env.REACT_APP_KEY);
        const passwordDecrypted = passwordByte.toString(CryptoJS.enc.Utf8);
        console.log('passwordDecrypted',passwordDecrypted);

        pwInfo.password = await AccountUtils.setPassword(passwordDecrypted);

        const results = await AccountRepository.updatePwd(connection, pwInfo);
        connection.end();

        resolve(results);
    });

}



exports.updateAccountWithTempPwd = (tempInfo) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        const validID = await AccountRepository.selectAccountWithMemberIdAndEmail(connection, tempInfo);

        if(validID.length < 1) {
            console.log('Invalid ID or email');
            return reject('Invalid ID or email');
        }
        
        tempInfo.memberCode = validID[0].memberCode;
        const tempPwd = await AccountUtils.generateTempPassword(); 
        tempInfo.password = await AccountUtils.setPassword(tempPwd);

        const results = await AccountRepository.updatePwd(connection, tempInfo);
        
        await EmailUtils.sendSearchPWMail(validID[0].email, tempPwd);

        connection.end();

        resolve(results);
    });

}

exports.selectAccountAndSendEmail = (email) => {
    console.log('selectAccountAndSendEmail');

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        const results = await AccountRepository.selectAccountWithEmail(connection, email);
        console.log(results);
        if(results.length < 1) {
            console.log('Invalid Email Address');
            return reject('Invalid Email Address');
        }
        console.log(results[0]);
        await EmailUtils.sendSearchIDMail(results[0]);

        connection.end();

        resolve(results[0]);
    });

}


exports.selectAccounts = () => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        const results = AccountRepository.selectAccounts(connection);

        connection.end();

        resolve(results);
    });
};


exports.selectAccountWithMemberCode = (memberCode) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        const results = AccountRepository.selectAccountWithMemberCode(connection, memberCode);

        connection.end();

        resolve(results);
    });
}




exports.registerAccount = (memberInfo) => {


    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try{

            const validationID = await AccountRepository.selectAccountWithMemberId(connection, memberInfo.id);
            console.log('validationID', validationID[0]);

            if(validationID[0]){
                console.log('Already ID registered');
                connection.rollback();
                return reject("Already ID registered");
            }


            const validationEmail = await AccountRepository.selectAccountWithEmail(connection, memberInfo.email);
            console.log('validationEmail', validationEmail[0]);

            if(validationEmail[0]){
                console.log('Already Email registered');
                connection.rollback();
                return reject("Already Email registered");
            }


            console.log('registerAccountBefore', memberInfo);
            memberInfo.password = await AccountUtils.setPassword(memberInfo.password);
    
            console.log('registerAccountAfter', memberInfo);
            const result = await AccountRepository.registerAccount(connection, memberInfo);

            const insertedAccount = await AccountRepository.selectAccountWithMemberCode(connection, result.insertId);
            console.log('insertedAccount', insertedAccount);
            
            connection.commit();

            // 이메일 인증을 위한 토큰 발급
            const token = await AccountUtils.generateToken(insertedAccount.memberCode, insertedAccount.memberId, insertedAccount.name, insertedAccount.email);
            
            
            //이메일 발송 프로세스
            await EmailUtils.sendMail(insertedAccount[0], token);
    
            resolve(insertedAccount);

        } catch (err) {
            console.log(err);
            connection.rollback();
            console.log('rooback succeeded');

            reject(err);
        } finally {
            connection.end();
            console.log('connection closed succeeded');
        }

    });
}


exports.loginAccount = (loginInfo) => {


    return new Promise(async (resolve, reject) => {
        
        const connection = getConnection();
        connection.beginTransaction();

        try{
            console.log('loginInfo', loginInfo);

            const results = await AccountRepository.selectAccountWithMemberId(connection, loginInfo.memberId);

            //검색되는 회원이 없을경우
            if(results.length < 1) {
                console.log('Invalid username or password');
                return reject('Invalid username or password');
            }

            console.log('account', results);
            const passwordByte = CryptoJS.AES.decrypt(loginInfo.password , process.env.REACT_APP_KEY);
            const password = passwordByte.toString(CryptoJS.enc.Utf8);
            const passwordCompareResult = await AccountUtils.checkPassword(password, results[0].password);
            console.log('passwordCompareResult',passwordCompareResult);


            if(!passwordCompareResult){
                // 패스워드 불일치
                console.log('Invalid username or password');
                return reject("Invalid username or password");
            } 



            const account = await AccountRepository.selectAccountWithMemberId(connection, loginInfo.memberId);
            if(account[0].emailAuth == 'N'){
                console.log('emailAuth', account[0].emailAuth);
                return reject("Invalid Email Auth");
            }

            account[0].password = '';

            //로그인 성공시 JWT 토큰 발급 ()emberId, memberName, memberEmail)
            const token = await AccountUtils.generateToken(account[0].memberCode, account[0].memberId, account[0].name, account[0].email, account[0].role);
            
            const resData = {
                account,
                token
            }


            const historyResult = await AccountRepository.insertAccountHistory(connection, results[0].memberCode);
            console.log('history result', historyResult);

            connection.commit();

            return resolve(resData);
            
        
        } catch (err) {

            console.log(err);
            connection.rollback();
            reject(err);

        } finally {

            connection.end();
            console.log('connection closed succeeded');
        }

        
    });
};


exports.emailAuthWithToken = (authInfo) => {
    
    return new Promise((resolve, reject) => {

        const connection = getConnection();
                                            
        if(!authInfo.token) {
            reject("No token provided!");
        }
    
        jwt.verify(authInfo.token, JWT_SECRET, (err, decodedInfo) => {
            if (err) {
                return res.status(401).json({
                    message: "Unauthorized!"
                });
            }     
        });      

        const results = AccountRepository.updateAccountWithToken(connection, authInfo.id);

        connection.end();

        resolve(results);
    });

}

exports.getMemberHistory = (memberCode) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        const results = AccountRepository.selectMemberHistoryWithMemberCode(connection, memberCode);

        connection.end();

        resolve(results);
    });

}
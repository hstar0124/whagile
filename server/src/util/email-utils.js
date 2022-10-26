const nodemailer = require('nodemailer');
require('dotenv').config();
const { REACT_APP_RESTAPI_IP } = process.env;

exports.sendAuthNumberMail = async (sendAuthNumberMail) => {
  return new Promise((resolve, reject) => {
    console.log('sendAuthNumberMail', sendAuthNumberMail);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "whagile99",
        pass: "rgipfmgcrxrvbzej"
      }
    });

    const info = transporter.sendMail({
      from: `"Whagile Team" <whagile99@gmail.com>"`,
      to: sendAuthNumberMail.email,
      subject: 'Whagile 인증번호',
      html: 
      `<h1>안녕하세요 웨자일 팀입니다.</h1><br/>      
      <br/>
      인증번호는 ${sendAuthNumberMail.authCode} 입니다.
      <br/>
      <br/>
      <br/>
      <br/>
      Whagile Team 올림
      `
    }, (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        resolve(info.messageId);
      }
    });

  });
}



exports.sendSearchPWMail = async (email, pw) => {
  return new Promise((resolve, reject) => {
    console.log('sendMail', pw);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "whagile99",
        pass: "rgipfmgcrxrvbzej"
      }
    });

    const info = transporter.sendMail({
      from: `"Whagile Team" <whagile99@gmail.com>"`,
      to: email,
      subject: 'Whagile 임시 비밀번호 발급',
      html: 
      `<h1>안녕하세요 웨자일 팀입니다.</h1><br/>      
      <br/>
      임시 비밀번호는 ${pw} 입니다.
      <br/>
      <br/>
      <br/>
      <br/>
      Whagile Team 올림
      `
    }, (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        resolve(info.messageId);
      }
    });

  });
}


exports.sendSearchIDMail = async (memberInfo) => {

  return new Promise((resolve, reject) => {
    console.log('sendMail', memberInfo.email);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "whagile99",
        pass: "rgipfmgcrxrvbzej"
      }
    });

    const info = transporter.sendMail({
      from: `"Whagile Team" <whagile99@gmail.com>"`,
      to: memberInfo.email,
      subject: 'Whagile 아이디 찾기',
      html: 
      `<h1>안녕하세요 웨자일 팀입니다.</h1><br/>      
      <br/>
      요청하신 아이디는 ${memberInfo.memberId} 입니다.
      <br/>
      <br/>
      <br/>
      <br/>
      Whagile Team 올림
      `
    }, (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        resolve(info.messageId);
      }
    });

  });


  
}


exports.sendMail = async (memberInfo, token) => {
  return new Promise((resolve, reject) => {
    console.log('sendMail', memberInfo.email);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "whagile99",
        pass: "rgipfmgcrxrvbzej"
      }
    });

    const info = transporter.sendMail({
      from: `"Whagile Team" <whagile99@gmail.com>"`,
      to: memberInfo.email,
      subject: 'Whagile 이메일 인증',
      html: 
      `<h1>안녕하세요 ${memberInfo.name} 님!</h1><br/>
      웨자일에 가입해주셔서 진심으로 감사합니다~!<br/>
      <br/>
      웨자일에 가입 완료하기 위해서는 이메일 인증이 필수입니다.<br/>
      아래 링크를 클릭하시면 인증이 완료됩니다.<br/>
      해당 링크는 48시간동안 유효합니다.<br/>
      <br/>
      <a href="http://whagile.shop:8888/api/account/emailauth?id=${memberInfo.memberCode}&token=${token}">인증 완료</a><br/>
      <br/>
      <br/>
      Whagile Team 올림
      `
    }, (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        resolve(info.messageId);
      }
    });

  });

}

exports.sendInvitationMail = async (memberInfo, projectInfo) => {
  return new Promise((resolve, reject) => {
    console.log('sendMail', memberInfo.memberEmail);
    console.log('project', projectInfo.projectName);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "whagile99",
        pass: "rgipfmgcrxrvbzej"
      }
    });

    const info = transporter.sendMail({
      from: `"Whagile Team" <whagile99@gmail.com>"`,
      to: memberInfo.memberEmail,
      subject: 'Whagile 프로젝트 초대',
      html: 
      `<h1>안녕하세요 ${ memberInfo.memberName } 님!</h1><br/>
      ${ projectInfo.projectName }에 초대 되셨습니다.<br/>
      <br/>
      아래 링크를 클릭하시면 초대를 수락합니다.<br/>
      <a href="http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${ projectInfo.projectCode }/joinedMember/${ memberInfo.memberCode }">초대 수락</a><br/>
      해당 링크는 48시간동안 유효합니다.<br/>
      <br/>
      <br/>
      <br/>
      Whagile Team 올림
      `
    }, (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        resolve(info.messageId);
      }
    });

  });

}

exports.sendInvitationMailToNewMember = async (email, projectInfo) => {
  return new Promise((resolve, reject) => {
    console.log('sendMail', email);
    console.log('project', projectInfo.projectName);

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: "whagile99",
        pass: "rgipfmgcrxrvbzej"
      }
    });

    const info = transporter.sendMail({
      from: `"Whagile Team" <whagile99@gmail.com>"`,
      to: email,
      subject: 'Whagile 프로젝트 초대',
      html: 
      `<h1>안녕하세요</h1><br/>
      ${ projectInfo.projectName }에 초대 되셨습니다.<br/>
      <br/>
      아래 링크를 클릭하시고 회원 가입을 하시면 해당 프로젝트에 초대됩니다.<br/>
      <a href="http://${process.env.REACT_APP_RESTAPI_IP}:3000/invitedMemberSignup/${ projectInfo.projectCode }/${ email }">초대 수락</a><br/>
      해당 링크는 48시간동안 유효합니다.<br/>
      <br/>
      <br/>
      <br/>
      Whagile Team 올림
      `
    }
    , (err, info) => {
      if(err){
        console.log(err);
        reject(err);
      } else {
        resolve(info.messageId);
      }
    });

  });

}
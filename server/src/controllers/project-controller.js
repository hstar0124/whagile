const HttpStatus = require('http-status');
const ProjectService = require('../services/project-service');
require('dotenv').config();
const { REACT_APP_RESTAPI_IP } = process.env;

exports.selectProjects = async (req, res, next) => {

    console.log(req.query)
    await ProjectService.selectProjects(req.query)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: '프로젝트 목록을 조회했습니다.',
                results: results
            });

        }).catch((err) =>{

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });

        });
};

exports.selectProject = async (req, res, next) => {
    console.log("req.params",req.params.projectCode);
    await ProjectService.selectProject(req.params.projectCode)
        .then((result) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully selected Project',
                results: result
            });
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.OK,
                message: err

            });
        });
};

exports.registProject = async (req, res, next) => {
console.log('이메일 들어오나?',req.body);
    await ProjectService.registProject(req.body)
        .then((result) => {
            res.status(HttpStatus.CREATED).json({
                status: HttpStatus.CREATED,
                message: '성공적으로 프로젝트를 추가했습니다.',
                results: result
            });
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status:HttpStatus.BAD_REQUEST,
                message: err
            });
        });
};

exports.modifyProject = async (req, res, next) => {
    await ProjectService.modifyProject(req.body)
        .then((result) => {
            
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully updatedProject!!',
                results: result
            });
            
        }).catch((err) => {
            
            res.status(HttpStatus.BAD_REQUEST).json({
                status:HttpStatus.BAD_REQUEST,
                message: err
            });
        });
}

exports.removeProject = async (req, res, next) => {

    console.log('프로젝트 삭제', req.query);
    
    await ProjectService.removeProject(req.query)
        .then((result) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully removedProject!!',
                results: result
            });
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST, 
                message: err
            });
        });
}

exports.findProjectMembers = async (req, res, next) => {
    
    await ProjectService.findProjectMember(req.params.projectCode)
        .then((results) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: '프로젝트 팀원 목록을 조회했습니다.',
                results: results
            });
        }).catch((err) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: err
            });
        });
}

exports.findProjectMemberInfo = async (req, res, next) => {

    await ProjectService.findProjectMemberInfo(req.params)
    .then((results) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: '프로젝트 팀원을 조회했습니다.',
            results: results
        });
    }).catch((err) => {

        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: err
        });
    });
}

exports.registProjectMember = async (req, res, next) => {

    await ProjectService.registProjectMember(req.params)
        .then(() => {
            
            if({REACT_APP_RESTAPI_IP} === 'whagile.shop') {
                res.redirect(`http://${process.env.REACT_APP_RESTAPI_IP}/`);
            } else {
                res.redirect(`http://${process.env.REACT_APP_RESTAPI_IP}:3000/`);
            }
            
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status:HttpStatus.BAD_REQUEST,
                message: err
            });
        });
}

exports.removeProjectMember = async (req, res, next) => {
    await ProjectService.removeProjectMember(req.params)
        .then((result) => {
            res.status(HttpStatus.OK).json({
                stauts: HttpStatus.OK,
                message: '해당 프로젝트에서 팀원을 제외했습니다.',
                results: result
            });
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status:HttpStatus.BAD_REQUEST,
                message: err
            });
        });
}

exports.inviteMember = async (req, res, next) => {

    await ProjectService.inviteMember(req.body)
        .then((result) => {

            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: '해당 이메일로 이메일을 전송했습니다.',
                results: result
            });
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });
};

exports.signUpProjectMember = async (req, res, next) => {

    await ProjectService.signUpProjectMember(req.body)
        .then((result) => {
            // res.redirect('http://whagile.shop:3000/login');
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: 'successfully regist Account!!',
                results: result
            });
        }).catch((err) => {

            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });
}

exports.modifyAuthorityOfMember = async (req, res, next) => {

    console.log('파람으로 건너온 데이터 확인 : ', req.body);

    const projectMemberInfo = {
        projectCode : req.params.projectCode,
        memberCode : req.params.memberCode,
        authorityCode : req.body.authorityCode
    }

    console.log('projectMemberInfo', projectMemberInfo);
    await ProjectService.modifyAuthorityOfMember(projectMemberInfo)
        .then((result) => {
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: '해당 프로젝트 멤버의 권한을 수정했습니다.',
                results: result
            });
        }).catch((err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });
}

exports.findNotice = async (req, res, next) => {

    await ProjectService.findNotice(req.params.projectCode)
        .then((result) => {
            res.status(HttpStatus.OK).json({
                status: HttpStatus.OK,
                message: '해당 프로젝트 공지사항을 조회했습니다.',
                results: result
            });
        }).catch((err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });
};

exports.modifyNoticeToProject = async (req, res, next) => {

    const noticeInfo = {
        projectCode : req.params.projectCode,
        modifier : req.body.modifier,
        content : req.body.content,
        noticeCode: req.body.noticeCode
    }

    await ProjectService.modifyNoticeToProject(noticeInfo)
        .then((result) => {
            res.status(HttpStatus.CREATED).json({
                status: HttpStatus.CREATED,
                message: '해당 프로젝트 공지사항을 수정했습니다.',
                results: result
            });
        }).catch((err) => {
            res.status(HttpStatus.BAD_REQUEST).json({
                status: HttpStatus.BAD_REQUEST,
                message: err
            });
        });
}

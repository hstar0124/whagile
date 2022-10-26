const HttpStatus = require('http-status');
const InquiryCommentService = require('../services/inquiry-comment-service');
const { decodedToken } = require('../util/account-utils');

/* 토큰에서 사용자 정보 꺼내기 */
getUserInfo = (accessToken) => {
    
    return decodedToken(accessToken);
 }

/* 1:1 문의 답변 등록 */
exports.registComment = async (req, res, next) => {

    const user = getUserInfo(req.get('Access-Token'));

    const newComment = {
        content: req.body.content,
        inquiryCode: req.body.inquiryCode,
        memberCode: user.usercode,
        answeredYN: 'Y'
    }

    const results = await InquiryCommentService.registComment(newComment);

    try {
        res.status(HttpStatus.CREATED).json({
            status: HttpStatus.CREATED,
            message: '답변이 등록되었습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    }
};

/* 1:1 문의 답변 조회 */
exports.findComment = async (req, res, next) => {

    const inquriyCode = Number(req.query.code);
    
    const results = await InquiryCommentService.findComment(inquriyCode);
    
    try {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: '답변을 조회하였습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    }
};

/* 1:1 문의 답변 수정 */
exports.modifyComment = async (req, res, next) => {

    console.log('################')
    const user = getUserInfo(req.get('Access-Token'));

    const modifyingContent = {
        inquiryCommentCode: req.body.inquiryCommentCode,
        inquiryCode : req.body.inquiryCode,
        content: req.body.content,
        memberCode: user.usercode
    };

    const results = await InquiryCommentService.modifyComment(modifyingContent);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '답변을 수정하였습니다.',
        results: results
    });
};

/* 1:1 문의 답변 삭제 */
exports.removeComment = async (req, res, next) => {

    const user = getUserInfo(req.get('Access-Token'));

    const params = {
        inquiryCommentCode: req.body.inquiryCommentCode,
        inquiryCode: req.body.inquiryCode,
        answeredYN: 'N',
        memberCode: user.usercode
    };

    const results = await InquiryCommentService.removeComment(params);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '답변이 삭제되었습니다.',
        results: results
    });
};
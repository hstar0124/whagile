const HttpStatus = require('http-status');
const InquiryService = require('../services/inquiry-service');
const { decodedToken } = require('../util/account-utils');

/* 토큰에서 사용자 정보 꺼내기 */
getUserInfo = (accessToken) => {
    
   return decodedToken(accessToken);
}

/* 1:1 문의 등록 */
exports.registInquiry = async (req, res, next) => {

    const user = getUserInfo(req.get('Access-Token'));
    
    const newInquiry = {
        title: req.body.title,
        content: req.body.content,
        memberCode: user.usercode,
        categoryCode: req.body.categoryCode
    }

    const results = await InquiryService.registInquiry(newInquiry);

    try {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.CREATED,
            message: '문의 글이 등록되었습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err,
        });
    }
};

/* 1:1 문의 목록 조회 */
exports.findInquiries = async (req, res, next) => {

    const user = getUserInfo(req.get('Access-Token'));

    const params = {
        offset: Number(req.query.offset),
        limit: Number(req.query.limit),
        filter: req.query.filter,
        searchValue: req.query.searchValue,
        memberRole: user.role,
        memberCode: user.usercode
    };
    const results = await InquiryService.findInquiries(params);

    try {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: '1:1문의 목록을 조회하였습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    }
};

/* 1:1 문의 상세 조회 */
exports.findInquiryByInquiryCode = async (req, res, next) => {

    const inquiryCode = Number(req.params.inquiryCode);

    const results = await InquiryService.findInquiryByInquiryCode(inquiryCode);

    try {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: '1:1문의 상세 내용을 조회하였습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    }
};

/* 1:1 문의 수정 */
exports.modifyInquiry = async (req, res, next) => {

    const user = getUserInfo(req.get('Access-Token'));

    const modifiedInquiry = {
        inquiryCode: req.body.inquiryCode,
        title: req.body.title,
        content: req.body.content,
        memberCode: user.usercode,
        categoryCode: req.body.categoryCode
    }

    const results = await InquiryService.modifyInquiry(modifiedInquiry);

    try {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: '문의 글이 수정되었습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err,
        });
    }
};

/* 1:1 문의 삭제 */
exports.removeInquiry = async (req, res, next) => {

    const user = getUserInfo(req.get('Access-Token'));

    const params = {
        inquiryCode: req.body.inquiryCode,
        memberCode: user.usercode
    }

    const results = await InquiryService.removeInquiry(params);

    try {
        res.status(HttpStatus.OK).json({
            status: HttpStatus.OK,
            message: '문의 삭제가 완료되었습니다.',
            results: results
        });
    } catch (err) {
        res.status(HttpStatus.BAD_REQUEST).json({
            status: HttpStatus.BAD_REQUEST,
            message: err
        });
    }
};
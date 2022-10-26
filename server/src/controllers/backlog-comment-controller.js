const HttpStatus = require('http-status');
const BacklogCommentService = require('../services/backlog-comment-service');
const { decodedToken } = require('../util/account-utils');


/* 백로그 댓글 조회 요청 */
exports.findBacklogComments = async (req, res, next) => {

    const params = {
        backlogCode: Number(req.params.backlogCode),
        offset: Number(req.query.offset),
        limit: Number(req.query.limit)
    };
    
    const results = await BacklogCommentService.findBacklogComments(params);
    
    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '댓글 조회에 성공했습니다.',
        results: results
    });
};

/* 백로그 댓글 생성 요청 */
exports.registComment = async (req, res, next) => {
    const user = decodedToken(req.get('Access-Token'));
    
    const newComment = {
        content: req.body.content,
        backlogCode: Number(req.body.backlogCode),
        projectCode: Number(req.body.projectCode),
        memberCode: user.usercode
    };
    console.log('newComment: ', newComment);

    const results = await BacklogCommentService.registComment(newComment);

    res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: '댓글 추가에 성공했습니다.',
        results: results
    });
};

/* 백로그 댓글 수정 요청 */
exports.editComment = async (req, res, next) => {
    const user = decodedToken(req.get('Access-Token'));

    const modifyingContent = {
        backlogCommentCode: Number(req.body.backlogCommentCode),
        content: req.body.modifiedComment,
        projectCode : Number(req.body.projectCode),
        memberCode: user.usercode
    };

    const results = await BacklogCommentService.editComment(modifyingContent);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '댓글 수정에 성공했습니다.',
        results: results
    });
};

/* 백로그 댓글 삭제 요청 */
exports.removeComment = async (req, res, next) => {
    const user = decodedToken(req.get('Access-Token'));

    const removeRequest = {
        backlogCommentCode: Number(req.body.backlogCommentCode),
        projectCode: Number(req.body.projectCode),
        memberCode: user.usercode
    };

    const results = await BacklogCommentService.removeComment(removeRequest);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '댓글 삭제에 성공했습니다.',
        results: results
    });
};
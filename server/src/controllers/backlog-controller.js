const HttpStatus = require('http-status');
const express = require('express');
const app = express();

const BacklogService = require('../services/backlog-service');

const { decodedToken } = require('../util/account-utils');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

/* 백로그 목록 조회 요청 */
exports.findAllBacklogs = async (req, res, next) => {

    /* querystring parameter로 넘어온 페이징 조건 및 필터링 조건을 추출 */
    const params = {
        offset: Number(req.query.offset),
        limit: Number(req.query.limit),
        projectCode: Number(req.query.projectCode),
        issue: Number(req.query.issue),
        progressStatus: req.query.progressStatus,
        urgency: req.query.urgency
    };

    const results = await BacklogService.findBacklogs(params);
    
    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '정상적으로 백로그 목록을 조회했습니다.',
        results: results
    });
};

/* 개별 백로그 상세조회 요청 */
exports.findBacklogsByBacklogCode = async (req, res, next) => {

    const backlogCode = Number(req.params.backlogCode);
    console.log(`backlogCode : ${backlogCode}`);

    const results = await BacklogService.findBacklogsByBacklogCode(backlogCode);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '정상적으로 개별 백로그를 조회했습니다.',
        results: results
    });
};

/* 새로운 백로그 생성 요청 */
exports.registNewBacklog = async (req, res, next) => {

    const user = decodedToken(req.get('Access-Token'));
    console.log(user)
    console.log(req.params)

    const backlog = {
        title: req.body.title,
        description: req.body.description,
        category: '백로그',
        urgency: req.body.urgency,
        issue: req.body.issue,
        projectCode: req.body.projectCode,
        creatorCode: user.usercode
    };
    console.log('backlog : ', backlog);

    const results = await BacklogService.registNewBacklog(backlog);
    
    res.status(HttpStatus.CREATED).json({
        status: HttpStatus.CREATED,
        message: '백로그가 생성되었습니다.',
        results: results
    });
};

/* 백로그 수정 요청 */
exports.editBacklog = async (req, res, next) => {

    const user = decodedToken(req.get('Access-Token'));
    console.log('여긴 백로그 수정 컨트롤러 메소드: ', req.body);

    const modifyingContent = {
        backlogCode: Number(req.body.backlogCode),
        projectCode: Number(req.body.projectCode),
        memberCode: user.usercode,
        changedItem: req.body.changedItem
    };

    const results = 
    await BacklogService.editBacklog(modifyingContent);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '정상적으로 개별 백로그 목록을 수정했습니다.',
        // results: results
    });
};

/* 백로그 삭제 요청 */
exports.removeBacklog = async (req, res, next) => {

    const user = decodedToken(req.get('Access-Token'));

    const removeRequest = {
        backlogCode: Number(req.body.backlogCode),
        projectCode: Number(req.body.projectCode),
        memberCode: user.usercode
    };

    const results = await BacklogService.removeBacklog(removeRequest);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '정상적으로 개별 백로그를 삭제했습니다.',
        results: results
    });
};

/* 백로그 히스토리 조회 요청 */
exports.findBacklogHistories = async (req, res, next) => {
    
    const params = {
        offset: Number(req.query.offset),
        limit: Number(req.query.limit)
    };
    
    const results = await BacklogService.findBacklogHistories(params);

    res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: '정상적으로 백로그 히스토리 조회했습니다.',
        results: results
    });

};
const getConnection = require("../database/connection");
const BacklogCommentRepository = require('../repositories/backlog-comment-repo');
const { removeRequest } = require("./backlog-service");

/* 히스토리 생성 함수 */
createNewHistory = () => {

    const newHistory = {
        historyType: '',
        modifiedComment: null,
        backlogCommentCode: 0,
        projectCode: 0,
        memberCode: 0
    };

    return newHistory;
};

/* 백로그 댓글 조회 요청 */
exports.findBacklogComments = (params) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        const results = BacklogCommentRepository.selectBacklogComments(connection, params);
        
        connection.end();

        resolve(results);
    });
};

/* 백로그 댓글 생성 요청 */
exports.registComment = (newComment) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try {
            /* 백로그 댓글 데이터 삽입 */
            const insertNewCommentResult = await BacklogCommentRepository.insertComment(connection, newComment);

            /* 백로그 댓글 히스토리 데이터 생성 */
            const newHistory = createNewHistory();
            newHistory.historyType = '생성';
            newHistory.modifiedComment = newComment.content;
            newHistory.backlogCommentCode = insertNewCommentResult.insertId;
            newHistory.projectCode = newComment.projectCode;
            newHistory.memberCode = newComment.memberCode;

            /* 백로그 댓글 히스토리 데이터 삽입 */
            const insertNewHistoryResult = await BacklogCommentRepository.insertBacklogCommentHistory(connection, newHistory);

            /* 추가한 백로그 히스토리 행 조회 */
            const insertedHistory = await BacklogCommentRepository.selectHistory(connection, insertNewCommentResult.insertId);

            connection.commit();

            resolve(insertedHistory);
            
        } catch(err) {
            connection.rollback();

            reject(err);

        } finally {
            connection.end();
        }
    });
};

/* 백로그 댓글 수정 요청 */
exports.editComment = (modifyingContent) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try {
            /* 백로그 댓글 데이터 수정 */
            await BacklogCommentRepository.updateComment(connection, modifyingContent);

            /* 수정된 댓글 조회 */
            const modifiedComment = await BacklogCommentRepository.selectBacklogComment(connection, modifyingContent.backlogCommentCode);

            /* 백로그 댓글 히스토리 데이터 생성 */
            const newHistory = createNewHistory();
            newHistory.historyType = '수정';
            newHistory.modifiedComment = modifyingContent.content;
            newHistory.backlogCommentCode = modifyingContent.backlogCommentCode;
            newHistory.projectCode = modifyingContent.projectCode;
            newHistory.memberCode = modifyingContent.memberCode;

            /* 백로그 댓글 히스토리 행 삽입 */
            const newHistoryInserted = await BacklogCommentRepository.insertBacklogCommentHistory(connection, newHistory);

            /* 추가한 백로그 히스토리 조회 */
            const insertedHistory = await BacklogCommentRepository.selectHistory(connection, newHistoryInserted.insertId);

            connection.commit();

            const results = {
                modifiedComment: modifiedComment,
                insertedHistory: insertedHistory
            };

            resolve(results);

        } catch(err) {
            connection.rollback();

            reject(err);

        } finally {
            connection.end();
        }
    });
};

/* 백로그 댓글 삭제 요청 */
exports.removeComment = (removeRequest) => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();
        connection.beginTransaction();

        try {
           /* 백로그 댓글 데이터 삭제 */
           await BacklogCommentRepository.deleteComment(connection, removeRequest);

           /* 삭제된 댓글 조회 */
           const deletedComment = await BacklogCommentRepository.selectBacklogComment(connection, removeRequest.backlogCommentCode);

           /* 백로그 댓글 히스토리 데이터 생성 */
           const newHistory = createNewHistory();
           newHistory.historyType = '삭제';
           newHistory.backlogCommentCode = removeRequest.backlogCommentCode;
           newHistory.projectCode = removeRequest.projectCode;
           newHistory.memberCode = removeRequest.memberCode;

           /* 백로그 댓글 히스토리 행 삽입 */
           const newHistoryInserted = await BacklogCommentRepository.insertBacklogCommentHistory(connection, newHistory);

           /* 추가한 백로그 히스토리 조회 */
           const insertedHistory = await BacklogCommentRepository.selectHistory(connection, newHistoryInserted.insertId);

           connection.commit();

           const results = {
               deletedComment: deletedComment,
               insertedHistory: insertedHistory
           };

           resolve(results);

        } catch(err) {
            connection.rollback();

            reject(err);

        } finally {
            connection.end();
        }
    });
};
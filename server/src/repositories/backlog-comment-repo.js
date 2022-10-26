const backlogCommentQuery = require('../database/backlog-comment-query');
const BacklogCommentDTO = require('../dto/backlog-comment/backlog-comment-response-dto');
const BacklogCommentHistoryDTO = require('../dto/backlog-comment/backlog-comment-history-response-dto');
const { removeRequest } = require('../services/backlog-service');

/* 백로그 댓글 조회 요청 */
exports.selectBacklogComments = (connection, params) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            backlogCommentQuery.selectBacklogComments(),
            [params.backlogCode, params.offset, params.limit],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                const backlogComments = [];
                for(let i = 0; i < results.length; i++) {
                    backlogComments.push(new BacklogCommentDTO(results[i]));
                }

                resolve(backlogComments);
            }
        );

        console.log(query.sql)
    });
};

/* 백로그 댓글 1개 행 조회 요청 */
exports.selectBacklogComment = (connection, backlogCommentCode) => {

    return new Promise((resolve, reject) => {
        const query = connection.query(
            backlogCommentQuery.selectBacklogComment(),
            backlogCommentCode,
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                const backlogComment = [];
                for(let i = 0; i < result.length; i++) {
                    backlogComment.push(new BacklogCommentDTO(result[i]));
                }

                resolve(backlogComment);
            }
        );
        console.log(query.sql);
    });
};

/* 백로그 댓글 생성 요청 */
exports.insertComment = (connection, newComment) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            backlogCommentQuery.insertComment(),
            [newComment.content, newComment.backlogCode, 
             newComment.projectCode, newComment.memberCode],
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(result);
            }
        );

        console.log(query.sql)
    });
};

/* 백로그 댓글 수정 요청 */
exports.updateComment = (connection, modifyingContent) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            backlogCommentQuery.updateComment(),
            [modifyingContent.content, modifyingContent.backlogCommentCode],
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(result);
            }
        );
    });
};

/* 백로그  댓글 삭제 요청 */
exports.deleteComment = (connection, removeRequest) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            backlogCommentQuery.deleteComment(),
            removeRequest.backlogCommentCode,
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(result);
            }
        );
        console.log(query.sql);
    });
};

/* 백로그 댓글 히스토리 생성 요청 */
exports.insertBacklogCommentHistory = (connection, newHistory) => {

    return new Promise((resolve, reject) => {
        const query = connection.query(
            backlogCommentQuery.insertBacklogCommentHistory(newHistory),
            (err, results, fields) => {
                
                if(err) {
                    reject(err);
                }
    
                resolve(results);
            }
        );

        console.log(query.sql);
    });
};

/* 백로그 댓글 히스토리 조회 요청 */
exports.selectHistory = (connection, historyCode) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            backlogCommentQuery.selectHistory(),
            historyCode, 
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                const backlogCommentHistory = [];
                for(let i = 0; i < result.length; i++) {
                    backlogCommentHistory.push(new BacklogCommentHistoryDTO(result[i]));
                }

                resolve(backlogCommentHistory);
            }
        );
        console.log(query.sql);
    });
};

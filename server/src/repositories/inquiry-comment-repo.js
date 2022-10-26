const inquiryCommentQuery = require('../database/inquiry-comment-query');
const InquiryCommentDTO = require('../dto/inquiry-comment/inquiry-comment-response-dto');

/* 1:1 문의 답변 등록 */
exports.insertComment = (connection, newComment) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryCommentQuery.insertComment(),
            [
                newComment.content,
                newComment.inquiryCode,
                newComment.memberCode
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};

/* 1:1 문의 답변 조회 */
exports.selectComment = (connection, inquiryCode) => {

    return new Promise((resolve, reject) => {

        const query = 
        connection.query(
            inquiryCommentQuery.selectComment(),
            [inquiryCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                const inquiryComments = [];
                for(let i = 0; i < results.length; i++) {
                    inquiryComments.push(new InquiryCommentDTO(results[i]));
                }
                
                resolve(inquiryComments);
            }
        );

        console.log(query.sql)
    });
};

/* 1:1 문의 답변 수정 */
exports.updateComment = (connection, modifyingContent) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            inquiryCommentQuery.updateComment(),
            [modifyingContent.content, modifyingContent.memberCode, modifyingContent.inquiryCommentCode],
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(result);
            }
        );
    });
};

/* 1:1 문의 답변 삭제 */
exports.deleteComment = (connection, inquiryCommentCode) => {

    return new Promise((resolve, reject) => {

        connection.query(
            inquiryCommentQuery.deleteComment(),
            inquiryCommentCode,
            (err, result, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(result);
            }
        );
    });
}

/* 1:1 문의 답변 히스토리 생성 */
exports.insertInquiryCommentHistory = (connection, newHistory) => {

    return new Promise((resolve, reject) => {
        connection.query(
            inquiryCommentQuery.insertInquiryCommentHistory(),
            [
                newHistory.modifiedContent,   
                newHistory.inquiryCommentCode,
                newHistory.memberCode
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                resolve(results);
            }
        );
    });
};
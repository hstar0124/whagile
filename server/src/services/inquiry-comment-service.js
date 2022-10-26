const getConnection = require('../database/connection');
const InquiryCommentRepository = require('../repositories/inquiry-comment-repo');
const InquiryRepository = require('../repositories/inquiry-repo');

/* 히스토리 생성 함수 */
createNewHistory = () => {

    return {
        modifiedContent: null,
        inquiryCommentCode: null,
        memberCode: null
    };
};

/* 1:1 문의 답변 등록 */
exports.registComment = (newComment) => {

    return new Promise(async (resolve, reject) => {
        const connection = getConnection();
        connection.beginTransaction();

        try {
            /* 1:1 문의 답변 데이터 삽입 */
            const result = await InquiryCommentRepository.insertComment(connection, newComment);

            /* 1:1 문의 답변 상태 변경 */
            await InquiryRepository.updateAnsweredStatus(connection, newComment.answeredYN, newComment.inquiryCode)

            /* 1:1 문의 답변 히스토리 데이터 생성 */
            const newHistory = createNewHistory();
            
            newHistory.modifiedContent = newComment.content;   
            newHistory.inquiryCommentCode = result.insertId;
            newHistory.memberCode = newComment.memberCode;

            /* 1:1 문의 답변 히스토리 데이터 삽입 */
            await InquiryCommentRepository.insertInquiryCommentHistory(connection, newHistory);

            connection.commit();

            resolve(result);

        } catch(err) {

            connection.rollback();

            reject(err);
        } finally {

            connection.end();
        }
    });
};

/* 1:1 문의 답변 조회 */
exports.findComment = (inquiryCode) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        const results = InquiryCommentRepository.selectComment(connection, inquiryCode);
        
        connection.end();

        resolve(results);
    });
};

/* 1:1 문의 답변 수정 */
exports.modifyComment = (modifyingContent) => {

    return new Promise(async (resolve, reject) => {
        const connection = getConnection();
        connection.beginTransaction();

        try {
            console.log('************************', modifyingContent)
            /* 1:1 문의 답변 수정 */
            const result = await InquiryCommentRepository.updateComment(connection, modifyingContent);

            /* 1:1 문의 답변 히스토리 데이터 생성 */
            const newHistory = createNewHistory();
            
            newHistory.modifiedContent = modifyingContent.content;   
            newHistory.inquiryCommentCode = modifyingContent.inquiryCommentCode;
            newHistory.memberCode = modifyingContent.memberCode;

            /* 1:1 문의 답변 히스토리 데이터 삽입 */
            await InquiryCommentRepository.insertInquiryCommentHistory(connection, newHistory);

            connection.commit();

            resolve(result);

        } catch(err) {

            connection.rollback();

            reject(err);
        } finally {

            connection.end();
        }
    });    
};

/* 1:1 문의 답변 삭제 */
exports.removeComment = (params) => {

    return new Promise(async (resolve, reject) => {
        const connection = getConnection();
        connection.beginTransaction();

        try {
            /* 1:1 문의 답변 삭제 */
            const result = await InquiryCommentRepository.deleteComment(connection, params.inquiryCommentCode);

            /* 1:1 문의 답변 상태 변경 */
            await InquiryRepository.updateAnsweredStatus(connection, params.answeredYN, params.inquiryCode)

            /* 1:1 문의 답변 히스토리 데이터 생성 */
            const newHistory = createNewHistory();
            
            newHistory.modifiedContent = '[삭제]';   
            newHistory.inquiryCommentCode = params.inquiryCommentCode;
            newHistory.memberCode = params.memberCode;

            /* 1:1 문의 답변 히스토리 데이터 삽입 */
            await InquiryCommentRepository.insertInquiryCommentHistory(connection, newHistory);

            connection.commit();

            resolve(result);

        } catch(err) {

            connection.rollback();

            reject(err);
        } finally {

            connection.end();
        }
    });
};
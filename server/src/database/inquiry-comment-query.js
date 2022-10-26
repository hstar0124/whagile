/* 1:1 문의 답변 행 삽입 요청 SQL */
exports.insertComment = () => {

    return `
        INSERT INTO TBL_INQUIRY_COMMENT
        (INQUIRY_COMMENT_CONTENT, INQUIRY_COMMENT_MODIFIED_DATE, INQUIRY_CODE, MEMBER_CODE)
        VALUES
        (?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?)
    `;
};

/* 1:1 문의 답변 조회 요청 SQL */
exports.selectComment = () => {

    return `
        SELECT
               A.INQUIRY_COMMENT_CODE
             , A.INQUIRY_COMMENT_CONTENT
             , A.INQUIRY_COMMENT_MODIFIED_DATE
             , A.INQUIRY_COMMENT_MODIFIED_YN
             , A.INQUIRY_CODE
             , A.MEMBER_CODE
             , B.MEMBER_NAME
          FROM TBL_INQUIRY_COMMENT A
          JOIN TBL_MEMBER B ON (A.MEMBER_CODE = B.MEMBER_CODE)
         WHERE A.INQUIRY_CODE = ?
           AND A.INQUIRY_COMMENT_DELETED_YN = 'N'
    `;
}

/* 1:1 문의 답변 수정 요청 SQL */
exports.updateComment = () => {

    return `
        UPDATE TBL_INQUIRY_COMMENT A
           SET A.INQUIRY_COMMENT_MODIFIED_YN = 'Y'
             , A.INQUIRY_COMMENT_MODIFIED_DATE = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
             , A.INQUIRY_COMMENT_CONTENT = ?
             , A.MEMBER_CODE = ?
         WHERE A.INQUIRY_COMMENT_CODE = ?
    `;
}

/* 1:1 문의 답변 삭제 요청 SQL */
exports.deleteComment = () => {

    return `
        UPDATE TBL_INQUIRY_COMMENT A
           SET A.INQUIRY_COMMENT_DELETED_YN = 'Y'
         WHERE A.INQUIRY_COMMENT_CODE = ?
    `;
};

/* 1:1 문의 답변 히스토리 행 삽입 요청 SQL */
exports.insertInquiryCommentHistory = () => {

    return `
        INSERT INTO TBL_INQUIRY_COMMENT_HISTORY
        (INQUIRY_COMMENT_MODIFIED_CONTENT, INQUIRY_COMMENT_CODE, MEMBER_CODE, INQUIRY_COMMENT_HISTORY_DATE)
        VALUES
        (?, ?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'))
    `;
};
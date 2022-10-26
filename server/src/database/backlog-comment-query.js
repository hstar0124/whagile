/* 백로그 댓글 조회 요청 SQL */
exports.selectBacklogComments = () => {

    return `
        SELECT
               A.BACKLOG_COMMENT_CODE
             , A.BACKLOG_COMMENT_CONTENT
             , A.BACKLOG_COMMENT_CREATED_DATE
             , A.BACKLOG_COMMENT_MODIFIED_DATE
             , A.BACKLOG_COMMENT_MODIFIED_YN
             , A.BACKLOG_COMMENT_DELETED_YN
             , A.BACKLOG_CODE
             , A.PROJECT_CODE
             , A.MEMBER_CODE
             , B.MEMBER_NAME
          FROM TBL_BACKLOG_COMMENT A
          JOIN TBL_PROJECT_MEMBER P ON (A.PROJECT_CODE = P.PROJECT_CODE) AND (A.MEMBER_CODE = P.MEMBER_CODE)
          JOIN TBL_MEMBER B ON (P.MEMBER_CODE = B.MEMBER_CODE)
         WHERE A.BACKLOG_COMMENT_DELETED_YN = 'N'
           AND A.BACKLOG_CODE = ?
          LIMIT ?, ?
    `;
};

/* 백로그 댓글 1개 행 조회 요청 SQL */
exports.selectBacklogComment = () => {

    return `
        SELECT
               A.BACKLOG_COMMENT_CODE
             , A.BACKLOG_COMMENT_CONTENT
             , A.BACKLOG_COMMENT_CREATED_DATE
             , A.BACKLOG_COMMENT_MODIFIED_DATE
             , A.BACKLOG_COMMENT_MODIFIED_YN
             , A.BACKLOG_COMMENT_DELETED_YN
             , A.BACKLOG_CODE
             , A.PROJECT_CODE
             , A.MEMBER_CODE
             , B.MEMBER_NAME
          FROM TBL_BACKLOG_COMMENT A
          JOIN TBL_PROJECT_MEMBER P ON (A.PROJECT_CODE = P.PROJECT_CODE) AND (A.MEMBER_CODE = P.MEMBER_CODE)
          JOIN TBL_MEMBER B ON (P.MEMBER_CODE = B.MEMBER_CODE)
         WHERE A.BACKLOG_COMMENT_CODE = ?
    `;
}

/* 백로그 댓글 삽입 요청 SQL */
exports.insertComment = () => {

    return `
        INSERT INTO TBL_BACKLOG_COMMENT
        (BACKLOG_COMMENT_CONTENT, BACKLOG_COMMENT_CREATED_DATE, BACKLOG_CODE, PROJECT_CODE, MEMBER_CODE)
        VALUES
        (?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?, ?)
    `;
};

/* 백로그 댓글 수정 요청 SQL */
exports.updateComment = () => {

    return `
        UPDATE TBL_BACKLOG_COMMENT A
           SET A.BACKLOG_COMMENT_CONTENT = ?
             , A.BACKLOG_COMMENT_MODIFIED_DATE = DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s')
             , A.BACKLOG_COMMENT_MODIFIED_YN = 'Y'
         WHERE A.BACKLOG_COMMENT_CODE = ?
    `;
};

/* 백로그 댓글 삭제 요청 SQL */
exports.deleteComment = () => {

    return `
        UPDATE TBL_BACKLOG_COMMENT A
           SET A.BACKLOG_COMMENT_DELETED_YN = 'Y'
         WHERE A.BACKLOG_COMMENT_CODE = ?        
    `;
};

/* 백로그 댓글 히스토리 삽입 요청 SQL */
exports.insertBacklogCommentHistory = (newHistory) => {

    let query = '';

    if(newHistory.modifiedComment != null) {
        query = `
            INSERT INTO TBL_BACKLOG_COMMENT_HISTORY
            (BACKLOG_COMMENT_HISTORY_CONTENT, BACKLOG_HISTORY_DATE, BACKLOG_MODIFIED_COMMENT_DETAIL, 
            BACKLOG_COMMENT_CODE, PROJECT_CODE, MEMBER_CODE)
            VALUES
            ('${newHistory.historyType}',  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), '${newHistory.modifiedComment}', 
             ${newHistory.backlogCommentCode}, ${newHistory.projectCode}, ${newHistory.memberCode})
             `;
    } else {
        query = `
            INSERT INTO TBL_BACKLOG_COMMENT_HISTORY
            (BACKLOG_COMMENT_HISTORY_CONTENT, BACKLOG_HISTORY_DATE,  
             BACKLOG_COMMENT_CODE, PROJECT_CODE, MEMBER_CODE)
            VALUES
            ('${newHistory.historyType}',  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), 
             ${newHistory.backlogCommentCode}, ${newHistory.projectCode}, ${newHistory.memberCode})
        `;
    }
    
    return query;
};

/* 백로그 댓글 히스토리 조회 요청 SQL */
exports.selectHistory = () => {

    return `
        SELECT 
               A.BACKLOG_COMMENT_HISTORY_CODE
             , A.BACKLOG_COMMENT_HISTORY_CONTENT
             , A.BACKLOG_HISTORY_DATE
             , A.BACKLOG_MODIFIED_COMMENT_DETAIL
             , A.BACKLOG_COMMENT_CODE
             , A.PROJECT_CODE
             , A.MEMBER_CODE
          FROM TBL_BACKLOG_COMMENT_HISTORY A
         WHERE A.BACKLOG_COMMENT_HISTORY_CODE = ?
    `;
};
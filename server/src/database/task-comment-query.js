// 전체 댓글 조회
exports.findAllTaskComments = () => {
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
          LEFT JOIN TBL_PROJECT_MEMBER P ON (A.PROJECT_CODE = P.PROJECT_CODE) AND (A.MEMBER_CODE = P.MEMBER_CODE)
          LEFT JOIN TBL_MEMBER B ON (P.MEMBER_CODE = B.MEMBER_CODE)
         WHERE A.BACKLOG_COMMENT_DELETED_YN = 'N'
           AND A.BACKLOG_CODE = ?
    `;
};

// 개별 댓글 조회
exports.getTaskComment = () => {
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
};

// 개별 댓글 등록
exports.registTaskComment = () => {
  return `
        INSERT INTO TBL_BACKLOG_COMMENT
        (BACKLOG_COMMENT_CONTENT, BACKLOG_COMMENT_CREATED_DATE, BACKLOG_CODE, PROJECT_CODE, MEMBER_CODE)
        VALUES
        (?, DATE_FORMAT(NOW(), "%Y-%m-%d %H:%i:%s"), ?, ?, ?)
    `;
};

// 개별 댓글 수정
exports.updateTaskComment = () => {
  return `
        UPDATE TBL_BACKLOG_COMMENT A
          SET A.BACKLOG_COMMENT_CONTENT = ?
            , A.BACKLOG_COMMENT_MODIFIED_DATE = DATE_FORMAT(NOW(), "%Y-%m-%d %H:%i:%s")
            , A.BACKLOG_COMMENT_MODIFIED_YN = 'Y'
        WHERE A.BACKLOG_COMMENT_CODE = ?     
    `;
};

// 개별 댓글 삭제
exports.deleteTaskComment = () => {
  return `
        UPDATE TBL_BACKLOG_COMMENT A
           SET A.BACKLOG_COMMENT_DELETED_YN = 'Y'
        WHERE A.BACKLOG_COMMENT_CODE = ?  
    `;
};


// 댓글 히스토리 생성
exports.insertTaskCommentHistory = (taskCommentHistory) => {

    let query = '';

    if (taskCommentHistory.modifiedComment != null) {
      query = `
            INSERT INTO TBL_BACKLOG_COMMENT_HISTORY
            (BACKLOG_COMMENT_HISTORY_CONTENT, BACKLOG_HISTORY_DATE, BACKLOG_MODIFIED_COMMENT_DETAIL, 
            BACKLOG_COMMENT_CODE, PROJECT_CODE, MEMBER_CODE)
            VALUES
            ('${taskCommentHistory.historyType}',  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), '${taskCommentHistory.modifiedComment}', 
             ${taskCommentHistory.taskCommentCode}, ${taskCommentHistory.projectCode}, ${taskCommentHistory.memberCode})
             `;
    } else {
      query = `
            INSERT INTO TBL_BACKLOG_COMMENT_HISTORY
            (BACKLOG_COMMENT_HISTORY_CONTENT, BACKLOG_HISTORY_DATE,  
             BACKLOG_COMMENT_CODE, PROJECT_CODE, MEMBER_CODE)
            VALUES
            ('${taskCommentHistory.historyType}',  DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), 
             ${taskCommentHistory.taskCommentCode}, ${taskCommentHistory.projectCode}, ${taskCommentHistory.memberCode})
        `;
    }
    
    return query;
};


// 댓글 히스토리 조회
exports.selectTaskCommentHistory = () => {

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
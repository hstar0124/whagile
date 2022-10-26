/* 백로그 목록 조회 요청 SQL */

exports.selectBacklogs = (params) => {
  let query = `
    SELECT 
           A.BACKLOG_CODE
         , A.BACKLOG_TITLE
         , A.BACKLOG_CATEGORY
         , A.BACKLOG_PROGRESS_STATUS
         , A.BACKLOG_URGENCY
         , A.BACKLOG_ISSUE
         , A.PROJECT_CODE
         , A.BACKLOG_CREATOR_CODE
         , C.MEMBER_NAME
      FROM TBL_BACKLOG A
      JOIN TBL_PROJECT_MEMBER B ON (A.PROJECT_CODE = B.PROJECT_CODE) AND (A.BACKLOG_CREATOR_CODE = B.MEMBER_CODE)
      JOIN TBL_MEMBER C ON (B.MEMBER_CODE = C.MEMBER_CODE)
     WHERE A.BACKLOG_DELETED_YN = 'N'
       AND A.PROJECT_CODE = ${params.projectCode}
       AND A.BACKLOG_CATEGORY = '백로그'
  `;

  if (!Number.isNaN(params.issue)) {
    query += `     AND A.BACKLOG_ISSUE = ${params.issue}
    `;
  }

  if (params.progressStatus !== undefined) {
    query += `     AND A.BACKLOG_PROGRESS_STATUS = '${params.progressStatus}'
    `;
  }

  if (params.urgency !== undefined) {
    query += `   AND A.BACKLOG_URGENCY = '${params.urgency}'
    `;
  }

  query += ` ORDER BY A.BACKLOG_CODE DESC
     LIMIT ${params.offset}, ${params.limit}`;

  return query;
};

/* 백로그 상세조회 요청 SQL */
exports.selectBacklogByBacklogCode = () => {
  return `
    SELECT
           A.BACKLOG_CODE
         , A.BACKLOG_TITLE
         , A.BACKLOG_DESCRIPTION
         , A.BACKLOG_PROGRESS_STATUS
         , A.BACKLOG_URGENCY
         , A.BACKLOG_CATEGORY
         , A.PROJECT_CODE
         , IFNULL(A.SPRINT_CODE, 0) AS SPRINT_CODE
         , IFNULL(C.SPRINT_NAME, '') AS SPRINT_NAME
         , A.BACKLOG_ISSUE
         , A.BACKLOG_CREATOR_CODE
         , (SELECT MEMBER_NAME FROM TBL_MEMBER WHERE MEMBER_CODE = A.BACKLOG_CREATOR_CODE) AS CREATOR_NAME
         , IFNULL(A.BACKLOG_CHARGER_CODE, 0) AS CHARGER_CODE
         , IFNULL((SELECT MEMBER_NAME FROM TBL_MEMBER WHERE MEMBER_CODE = A.BACKLOG_CHARGER_CODE), '') AS CHARGER_NAME
         , A.BACKLOG_DELETED_YN
      FROM TBL_BACKLOG A
      JOIN TBL_PROJECT_MEMBER B ON (A.PROJECT_CODE = B.PROJECT_CODE) AND (A.BACKLOG_CREATOR_CODE = B.MEMBER_CODE)
      LEFT JOIN TBL_SPRINT C ON (A.SPRINT_CODE = C.SPRINT_CODE)
      JOIN TBL_MEMBER D ON (B.MEMBER_CODE = D.MEMBER_CODE)
     WHERE A.BACKLOG_CODE = ?
  `;
}

/* 백로그 행 삽입 요청 SQL */
exports.insertNewBacklog = () => {
  return `
    INSERT INTO TBL_BACKLOG
    (BACKLOG_TITLE, BACKLOG_DESCRIPTION, BACKLOG_CATEGORY, 
      BACKLOG_URGENCY, BACKLOG_ISSUE, PROJECT_CODE, BACKLOG_CREATOR_CODE)
    VALUES
    (?, ?, ?, ?, ?, ?, ?)
  `;
};

/* 백로그 히스토리 행 삽입 요청 SQL */
exports.insertBacklogHistory = () => {

  return `
    INSERT INTO TBL_BACKLOG_HISTORY
    (BACKLOG_HISTORY_ITEM, BACKLOG_HISTORY_CONTENT, BACKLOG_HISTORY_DATE, BACKLOG_CODE, PROJECT_CODE, MEMBER_CODE)
    VALUES
    (?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?, ?)
  `;
};

/* 백로그 히스토리 1개 행 조회 요청 SQL */
exports.selectHistoryByHistoryCode = () => {

  return `
    SELECT
           A.BACKLOG_HISTORY_CODE
         , A.BACKLOG_HISTORY_ITEM
         , A.BACKLOG_HISTORY_CONTENT
         , A.BACKLOG_HISTORY_DATE
         , A.BACKLOG_CODE
         , A.PROJECT_CODE
         , A.MEMBER_CODE
      FROM TBL_BACKLOG_HISTORY A
     WHERE A.BACKLOG_HISTORY_CODE = ?
  `;
};

/* 백로그 수정 요청 SQL */
exports.editBacklog = (modifyingContent) => {

  let query = `
    UPDATE TBL_BACKLOG A
       SET`;
    
  const target = modifyingContent.changedItem;

  if(target.title) {
    query += `
     A.BACKLOG_TITLE = '${ target.title }',`;
  }

  if(target.description) {
    query += `
     A.BACKLOG_DESCRIPTION = '${ target.description }',`;
  }
  
  if(typeof(target.issue) == 'number') {
    query += `
     A.BACKLOG_ISSUE = '${ Number(target.issue) }',`;
  }

  if(target.urgency) {
    query += `
     A.BACKLOG_URGENCY = '${ target.urgency }',`;
  }

  if(typeof(target.sprint) == 'number') {
    query += `
     A.BACKLOG_CATEGORY = '일감',
     A.BACKLOG_PROGRESS_STATUS = '진행 전',
     A.SPRINT_CODE = ${ Number(target.sprint) },`;
  }

  query = query.slice(0, -1);
  query += `
   WHERE A.BACKLOG_CODE = ${ modifyingContent.backlogCode }`;

  return query;
};

/* 백로그 삭제 요청 SQL */
exports.deleteBacklog = () => {

  return `
      UPDATE TBL_BACKLOG A
         SET A.BACKLOG_DELETED_YN = 'Y'
       WHERE A.BACKLOG_CODE = ?
  `;
};

/* 백로그 히스토리 조회 요청 SQL */
exports.selectBacklogHistories = () => {

  return `
    SELECT
           A.BACKLOG_HISTORY_CODE
         , A.BACKLOG_HISTORY_ITEM
         , A.BACKLOG_HISTORY_CONTENT
         , A.BACKLOG_HISTORY_DATE
         , A.BACKLOG_CODE
         , A.PROJECT_CODE
         , A.MEMBER_CODE
      FROM TBL_BACKLOG_HISTORY A
     ORDER BY A.BACKLOG_HISTORY_CODE DESC
     LIMIT ?, ?
  `;
};
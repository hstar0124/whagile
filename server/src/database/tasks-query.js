
// 전체 일감 목록 조회
exports.selectTasks = (params) => {

  let query = `
       SELECT
              A.BACKLOG_CODE
            , A.BACKLOG_TITLE
            , A.BACKLOG_CHARGER_CODE
            , A.BACKLOG_CATEGORY
            , A.BACKLOG_DESCRIPTION
            , A.BACKLOG_PROGRESS_STATUS
            , A.BACKLOG_URGENCY
            , A.BACKLOG_ISSUE  
            , A.PROJECT_CODE
            , A.BACKLOG_CREATOR_CODE
            , A.SPRINT_CODE
            , A.BACKLOG_CHARGER_CODE
            , E.MEMBER_NAME
         FROM TBL_BACKLOG A
         LEFT JOIN TBL_SPRINT B ON (A.SPRINT_CODE = B.SPRINT_CODE)
         LEFT JOIN TBL_PROJECT C ON (A.PROJECT_CODE = C.PROJECT_CODE)
         LEFT JOIN TBL_PROJECT_MEMBER D ON (A.PROJECT_CODE = D.PROJECT_CODE) AND (A.BACKLOG_CREATOR_CODE = D.MEMBER_CODE)
         LEFT JOIN TBL_MEMBER E ON (D.MEMBER_CODE = E.MEMBER_CODE)
        WHERE BACKLOG_DELETED_YN = 'N'
    `;

    if(params.projectCode !== undefined) {
      query += `\nAND A.PROJECT_CODE = ${params.projectCode}`;
    }

    if(params.sprintCode !== undefined) {
      query += `\nAND A.SPRINT_CODE = ${params.sprintCode}`;
    }

    if(params.backlogCategory !== undefined) {
      query += `\nAND A.BACKLOG_CATEGORY = '${params.backlogCategory}'`;
    }

    query += `\nORDER BY A.BACKLOG_CODE ASC`;

    // console.log("backlogsQuery",query)

  return query;
};




// 개별 일감 조회
exports.selectTaskbyTaskCode = () => {
  let query = `
       SELECT
              A.BACKLOG_CODE
            , A.BACKLOG_TITLE
            , A.BACKLOG_CHARGER_CODE
            , A.BACKLOG_CATEGORY
            , A.BACKLOG_DESCRIPTION
            , A.BACKLOG_PROGRESS_STATUS
            , A.BACKLOG_URGENCY
            , A.BACKLOG_ISSUE  
            , A.PROJECT_CODE
            , A.BACKLOG_CREATOR_CODE
            , A.SPRINT_CODE
            , A.BACKLOG_CHARGER_CODE
            , B.SPRINT_NAME
            , A.BACKLOG_START_DATE
            , A.BACKLOG_END_DATE
            , E.MEMBER_NAME
         FROM TBL_BACKLOG A
         LEFT JOIN TBL_SPRINT B ON (A.SPRINT_CODE = B.SPRINT_CODE)
         LEFT JOIN TBL_MEMBER E ON (A.BACKLOG_CHARGER_CODE = E.MEMBER_CODE)
        WHERE BACKLOG_DELETED_YN = 'N'
        AND A.BACKLOG_CODE = ?
        ORDER BY BACKLOG_CODE ASC
    `;
  return query;
}



// 개별 일감 생성
exports.insertNewTask = () => {
  return `
      INSERT INTO TBL_BACKLOG 
      (
        BACKLOG_TITLE
      , BACKLOG_DESCRIPTION
      , BACKLOG_PROGRESS_STATUS
      , BACKLOG_URGENCY
      , BACKLOG_CHARGER_CODE
      , BACKLOG_CATEGORY
      , SPRINT_CODE
      , PROJECT_CODE
      , BACKLOG_CREATOR_CODE
      , BACKLOG_ISSUE
      ) 
        VALUES 
      (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
};



// 개별 일감 수정
exports.updateTask = (params) => {

  let query = `
    UPDATE TBL_BACKLOG
    SET
      SPRINT_CODE = ${params.sprintCode},`;
    
  if (params.backlogTitle) {
    query += `
     BACKLOG_TITLE = '${params.backlogTitle}',`;
  }
  
  if (params.backlogDescription) {
    query += `
     BACKLOG_DESCRIPTION = '${params.backlogDescription}',`;
  }
  
  if (params.urgency) {
    query += `
    BACKLOG_URGENCY = '${params.urgency}',`;
  }
  
  if (params.backlogCategory) {
    query += `
    BACKLOG_CATEGORY = '${params.backlogCategory}',`;
  }
  
  if (params.backlogChargerCode !== undefined) {
    query += `
    BACKLOG_CHARGER_CODE = ${params.backlogChargerCode},`;
  }
  
  if (
    params.backlogStartDate !== undefined &&
    params.backlogEndDate !== undefined
    ) {
      query += ` 
      BACKLOG_START_DATE = '${params.backlogStartDate}',
      BACKLOG_END_DATE = '${params.backlogEndDate}',`;
    }
    
  if(params.issue) {
    query += `
    BACKLOG_ISSUE = '${ params.issue }',`;
  }
  
  if(params.progressStatus) {
    query += `
      BACKLOG_PROGRESS_STATUS = '${ params.progressStatus }'`;
  }

  query += `
  WHERE BACKLOG_CODE = ${params.backlogCode}`;


  // console.log("query",query);
  return query;
    
  };


// 개별 백로그 삭제
exports.deleteTask = () => {
  return `
      UPDATE TBL_BACKLOG A
         SET A.BACKLOG_DELETED_YN = 'Y'
       WHERE A.BACKLOG_CODE = ?
  `;
};

// 개별 일감 삭제( 상태 변경 )
exports.removeTask = () => {
  return `
      UPDATE TBL_BACKLOG A
         SET 
            A.BACKLOG_PROGRESS_STATUS = '백로그',
            A.BACKLOG_CATEGORY = '백로그',
            A.SPRINT_CODE = NULL
       WHERE A.BACKLOG_CODE = ?
  `;
};



// 일감(백로그) 히스토리 생성

exports.insertTaskHistory = () => {
  return `
    INSERT INTO TBL_BACKLOG_HISTORY
    (BACKLOG_HISTORY_ITEM, BACKLOG_HISTORY_CONTENT, BACKLOG_HISTORY_DATE, BACKLOG_CODE, PROJECT_CODE, MEMBER_CODE)
    VALUES
    (?, ?, DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?, ?)
  `;
};




// 일감(백로그) 히스토리 개별 조회
exports.selectTaskHistorybyHistoryCode = () => {
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




// 일감(백로그) 히스토리 전체 조회
exports.selectTaskHistories = () => {
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
  `;
};

// 일감(백로그) 히스토리 전체 조회
exports.updateTaskDate = () => {

  let query = `
    UPDATE TBL_BACKLOG
    SET
        BACKLOG_START_DATE = ?
      , BACKLOG_END_DATE = ?
    WHERE
      BACKLOG_CODE = ?
  `;
  
  return query;
};
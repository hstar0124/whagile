exports.insertSprint = () => {

    let query = `
        INSERT INTO TBL_SPRINT (
              SPRINT_NAME
            , SPRINT_TARGET
            , SPRINT_START_DATE
            , SPRINT_END_DATE
            , SPRINT_PROGRESS_STATUS
            , SPRINT_DELETED_YN
            , PROJECT_CODE
        ) VALUES (
              ?
            , ?
            , ?
            , ?
            , 'N'
            , 'N'
            , ?
        )
    `;

    return query;
}

exports.selectSprints = (params) => {

    let query = `
        SELECT 
            SPRINT_CODE
            , SPRINT_NAME
            , SPRINT_TARGET
            , SPRINT_START_DATE
            , SPRINT_END_DATE
            , SPRINT_PROGRESS_STATUS
            , PROJECT_CODE
        FROM TBL_SPRINT
        WHERE 
            SPRINT_DELETED_YN = 'N'
            AND PROJECT_CODE = ?
    `;

    if((   params.searchCondition === 'name'
        || params.searchCondition === 'target' 
        || params.searchCondition === 'progress_status') 
        && params.searchValue !== undefined) { // 조건 검색
        query += `AND ${'SPRINT_' + params.searchCondition.toUpperCase()} LIKE '%${params.searchValue}%'`;
    }
    
    if((   params.orderCondition === 'code' 
        || params.orderCondition === 'name' 
        || params.orderCondition === 'start_date' 
        || params.orderCondition === 'end_date' 
        || params.orderCondition === 'progress_status') 
        &&(params.orderValue.toLowerCase() === 'asc'
        || params.orderValue.toLowerCase() === 'desc')) { // 정렬
        query += `\nORDER BY ${'SPRINT_' + params.orderCondition.toUpperCase()} ${params.orderValue.toUpperCase()}`;
    } else if(params.isGantt) {
        query += `\nORDER BY SPRINT_PROGRESS_STATUS DESC, SPRINT_CODE DESC`;
    }
    
    if(params.offset !== undefined && params.limit !== undefined) { // 페이징
        query += `\nLIMIT ${params.offset}, ${params.limit}`;
    }
    
    return query;
}

exports.selectSprintHistory = (params) => {
    
    let query = `
        SELECT 
            SPRINT_HISTORY_CODE
            , SPRINT_HISTORY_ITEM
            , SPRINT_HISTORY_CONTENT
            , SPRINT_HISTORY_DATE
            , SPRINT_CODE
            , MEMBER_CODE
            , PROJECT_CODE
        FROM TBL_SPRINT_HISTORY
        WHERE 1 = 1
    `;

    if(params.sprintCode !== undefined) {
        query += `AND SPRINT_CODE = ${params.sprintCode}`;
    }

    if(params.projectCode !== undefined) {
        query += `AND PROJECT_CODE = ${params.projectCode}`;
    }

    if((   params.searchCondition === 'item'
        || params.searchCondition === 'content') 
        && params.searchValue !== undefined) { // 조건 검색
        query += `AND ${'SPRINT_HISTORY_' + params.searchCondition.toUpperCase()} LIKE '%${params.searchValue}%'`;
    }

    if((   params.orderCondition === 'code' 
        || params.orderCondition === 'item' 
        || params.orderCondition === 'date') 
        &&(params.orderValue.toLowerCase() === 'asc'
        || params.orderValue.toLowerCase() === 'desc')) { // 정렬
        query += `\nORDER BY ${'SPRINT_HISTORY_' + params.orderCondition.toUpperCase()} ${params.orderValue.toUpperCase()}`;
    }

    if(params.offset !== undefined && params.limit !== undefined) { // 페이징
        query += `\nLIMIT ${params.offset}, ${params.limit}`;
    }

    return query;
}

exports.selectSprint = () => {

    let query = `
        SELECT 
              SPRINT_CODE
            , SPRINT_NAME
            , SPRINT_TARGET
            , SPRINT_START_DATE
            , SPRINT_END_DATE
            , SPRINT_PROGRESS_STATUS
            , PROJECT_CODE
        FROM TBL_SPRINT
        WHERE 
            SPRINT_DELETED_YN = 'N'
            AND SPRINT_CODE = ?
    `;

    return query;
}

exports.updateSprint = () => {

    let query = `
        UPDATE TBL_SPRINT
        SET
              SPRINT_NAME = ?
            , SPRINT_TARGET = ?
            , SPRINT_START_DATE = ?
            , SPRINT_END_DATE = ?
            , SPRINT_PROGRESS_STATUS = ?
        WHERE
            SPRINT_CODE = ?
    `;

    return query;
}

exports.deleteSprint = () => {

    let query = `
        UPDATE TBL_SPRINT
        SET
            SPRINT_DELETED_YN = 'Y'
        WHERE
            SPRINT_CODE = ?
    `;

    return query;
}

/* tasks쪽이 작업중이라 나만 쓰는 임시 쿼리 */
exports.selectTasks = () => {
    
    let query = `
        SELECT
              B.BACKLOG_CODE
            , B.BACKLOG_TITLE
            , B.BACKLOG_DESCRIPTION
            , B.BACKLOG_PROGRESS_STATUS
            , B.BACKLOG_URGENCY
            , B.BACKLOG_CHARGER_CODE
            , B.BACKLOG_CATEGORY
            , B.SPRINT_CODE
            , B.BACKLOG_CREATOR_CODE
            , B.BACKLOG_ISSUE  
            , B.BACKLOG_START_DATE
            , B.BACKLOG_END_DATE
            , M.MEMBER_NAME
        FROM TBL_BACKLOG B
        LEFT JOIN TBL_MEMBER M ON (B.BACKLOG_CHARGER_CODE = M.MEMBER_CODE)
        WHERE SPRINT_CODE = ?
            AND B.BACKLOG_DELETED_YN = 'N'
            AND B.BACKLOG_CATEGORY = '일감'
    `;
  
    return query;
};

exports.insertTask = () => {

    let query = `
        INSERT INTO TBL_BACKLOG (
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
            , BACKLOG_START_DATE
            , BACKLOG_END_DATE
        ) VALUES (
            ?
            , ?
            , '진행 전'
            , ?
            , ?
            , '일감'
            , ?
            , ?
            , ?
            , ?
            , ?
            , ?
        )
    `;

    return query;
};

exports.updateBacklogToTask = () => {

    let query = `
        UPDATE TBL_BACKLOG
        SET
              BACKLOG_PROGRESS_STATUS = '진행 전'
            , BACKLOG_CATEGORY = '일감'
            , SPRINT_CODE = ?
        WHERE
            BACKLOG_CODE = ?
    `;

    return query;
}

exports.updateTaskToBacklogBySprintCode = () => {

    let query = `
        UPDATE TBL_BACKLOG
        SET
              BACKLOG_PROGRESS_STATUS = '백로그'
            , BACKLOG_CATEGORY = '백로그'
            , SPRINT_CODE = NULL
            , BACKLOG_START_DATE = NULL
            , BACKLOG_END_DATE = NULL
        WHERE
            SPRINT_CODE = ?
            AND (
                BACKLOG_PROGRESS_STATUS = '진행 전'
                OR BACKLOG_PROGRESS_STATUS = '진행 중'
            )
    `;

    return query;
}

exports.updateTaskToBacklogByBacklogCode = () => {

    let query = `
        UPDATE TBL_BACKLOG
        SET
              BACKLOG_PROGRESS_STATUS = '백로그'
            , BACKLOG_CATEGORY = '백로그'
            , SPRINT_CODE = NULL
            , BACKLOG_START_DATE = NULL
            , BACKLOG_END_DATE = NULL
        WHERE
            BACKLOG_CODE = ?
    `;

    return query;
}

exports.selectSprintsCount = (params) => {

    let query = `
        SELECT COUNT(*) COUNT
        FROM TBL_SPRINT
        WHERE SPRINT_DELETED_YN = 'N' 
            AND PROJECT_CODE = ?
    `;

    if((   params.searchCondition === 'name'
        || params.searchCondition === 'target' 
        || params.searchCondition === 'progress_status') 
        && params.searchValue !== undefined) { // 조건 검색
        query += `AND ${'SPRINT_' + params.searchCondition.toUpperCase()} LIKE '%${params.searchValue}%'`;
    }

    return query;
}

exports.insertSprintHistory = () => {

    let query = `
        INSERT INTO TBL_SPRINT_HISTORY (
              SPRINT_HISTORY_ITEM
            , SPRINT_HISTORY_CONTENT
            , SPRINT_HISTORY_DATE
            , SPRINT_CODE
            , MEMBER_CODE
            , PROJECT_CODE
        ) VALUES (
              ?
            , ?
            , NOW()
            , ?
            , ?
            , ?
        )
    `;

    return query;
}

exports.updateSprintProgress = () => {

    let query = `
        UPDATE TBL_SPRINT
        SET
            SPRINT_PROGRESS_STATUS = ?
        WHERE
            SPRINT_CODE = ?
    `;
    
    return query;
}
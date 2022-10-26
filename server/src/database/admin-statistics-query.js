exports.selectCounts = () => {

    let query = `
        SELECT 
            (
                SELECT COUNT(*)
                FROM TBL_MEMBER 
                WHERE MEMBER_ID NOT IN ('admin')
                    AND MEMBER_SECESSION_YN = 'N'
            ) ALL_MEMBER_COUNT,
            (
                SELECT COUNT(*)
                FROM TBL_PROJECT 
                WHERE PROJECT_DELETED_STATUS = 'N'
            ) ALL_PROJECT_COUNT,
            (
                SELECT COUNT(*)
                FROM TBL_SPRINT 
                WHERE SPRINT_DELETED_YN = 'N'
            ) ALL_SPRINT_COUNT,
            (
                SELECT COUNT(*)
                FROM TBL_BACKLOG 
                WHERE BACKLOG_DELETED_YN = 'N'
                    AND BACKLOG_CATEGORY = '일감'
            ) ALL_TASK_COUNT,
            (
                SELECT COUNT(*)
                FROM TBL_BACKLOG 
                WHERE BACKLOG_DELETED_YN = 'N'
                    AND BACKLOG_CATEGORY = '백로그'
            ) ALL_BACKLOG_COUNT,
            (
                SELECT COUNT(*)
                FROM TBL_INQUIRY  
                WHERE INQUIRY_DELETED_YN = 'N'
                    AND INQUIRY_ANSWER_YN = 'N'
            ) UNANSWERED_INQUIRY_COUNT
    `;

    return query;
}

exports.selectNewUserCount = (params) => {
    
    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(MEMBER_CREATED_DATE, 1, 2) day, COUNT(*) count
            FROM TBL_MEMBER 
            WHERE MEMBER_ID NOT IN ('admin')
                AND MEMBER_SECESSION_YN = 'N'
                AND MEMBER_CREATED_DATE LIKE '%${params.searchValue.toString().substr(3, 5)}%'
            GROUP BY SUBSTR(MEMBER_CREATED_DATE, 1, 2)
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(MEMBER_CREATED_DATE, 4, 2) day, COUNT(*) count
            FROM TBL_MEMBER 
            WHERE MEMBER_ID NOT IN ('admin')
                AND MEMBER_SECESSION_YN = 'N'
                AND MEMBER_CREATED_DATE LIKE '%${params.searchValue.toString().substr(5, 3)}%'
            GROUP BY SUBSTR(MEMBER_CREATED_DATE, 4, 2)
        `;
    }
            
    return query;
}

exports.selectResignedUserCount = (params) => {

    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(MEMBER_HISTORY_INDEX, 9, 2) day, COUNT(DISTINCT MEMBER_CODE) count
            FROM TBL_MEMBER_HISTORY
            WHERE MEMBER_HISTORY_INDEX LIKE '%${params.searchValue2.toString().substr(0, 7)}%'
                AND MEMBER_CODE != 6
                AND MEMBER_HISTORY_ITEM = '탈퇴'
            GROUP BY SUBSTR(MEMBER_HISTORY_INDEX, 9, 2);
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(MEMBER_HISTORY_INDEX, 6, 2) day, COUNT(DISTINCT MEMBER_CODE) count
            FROM TBL_MEMBER_HISTORY
            WHERE MEMBER_HISTORY_INDEX LIKE '%${params.searchValue2.toString().substr(0, 4)}%'
                AND MEMBER_CODE != 6
                AND MEMBER_HISTORY_ITEM = '탈퇴'
            GROUP BY SUBSTR(MEMBER_HISTORY_INDEX, 6, 2);
        `;
    }
            
    return query;
}

exports.selectNewProjectCount = (params) => {

    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(PROJECT_HISTORY_DATE, 9, 2) day, COUNT(*) count
            FROM TBL_PROJECT PR
            LEFT JOIN TBL_PROJECT_HISTORY HI ON PR.PROJECT_CODE = HI.PROJECT_CODE
            WHERE PROJECT_DELETED_STATUS = 'N'
                AND HI.PROJECT_HISTORY_CONTENT = '생성'
                AND PROJECT_HISTORY_DATE LIKE '%${params.searchValue2.toString().substr(0, 7)}%'
            GROUP BY SUBSTR(PROJECT_HISTORY_DATE, 9, 2)
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(PROJECT_HISTORY_DATE, 6, 2) day, COUNT(*) count
            FROM TBL_PROJECT PR
            LEFT JOIN TBL_PROJECT_HISTORY HI ON PR.PROJECT_CODE = HI.PROJECT_CODE
            WHERE PROJECT_DELETED_STATUS = 'N'
                AND HI.PROJECT_HISTORY_CONTENT = '생성'
                AND PROJECT_HISTORY_DATE LIKE '%${params.searchValue2.toString().substr(0, 4)}%'
            GROUP BY SUBSTR(PROJECT_HISTORY_DATE, 6, 2)
        `;
    }
            
    return query;
}

exports.selectNewSprintCount = (params) => {

    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(SPRINT_HISTORY_DATE, 9, 2) day, COUNT(*) count
            FROM TBL_SPRINT_HISTORY
            WHERE SPRINT_HISTORY_CONTENT = '생성'
                AND SPRINT_HISTORY_DATE LIKE '%${params.searchValue2.toString().substr(0, 7)}%'
            GROUP BY SUBSTR(SPRINT_HISTORY_DATE, 9, 2)
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(SPRINT_HISTORY_DATE, 6, 2) day, COUNT(*) count
            FROM TBL_SPRINT_HISTORY
            WHERE SPRINT_HISTORY_CONTENT = '생성'
                AND SPRINT_HISTORY_DATE LIKE '%${params.searchValue2.toString().substr(0, 4)}%'
            GROUP BY SUBSTR(SPRINT_HISTORY_DATE, 6, 2)
        `;
    }
            
    return query;
}

exports.selectDeletedSprintCount = (params) => {

    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(SPRINT_HISTORY_DATE, 9, 2) day, COUNT(*) count
            FROM TBL_SPRINT_HISTORY
            WHERE SPRINT_HISTORY_CONTENT = '삭제'
                AND SPRINT_HISTORY_DATE LIKE '%${params.searchValue2.toString().substr(0, 7)}%'
            GROUP BY SUBSTR(SPRINT_HISTORY_DATE, 9, 2)
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(SPRINT_HISTORY_DATE, 6, 2) day, COUNT(*) count
            FROM TBL_SPRINT_HISTORY
            WHERE SPRINT_HISTORY_CONTENT = '삭제'
                AND SPRINT_HISTORY_DATE LIKE '%${params.searchValue2.toString().substr(0, 4)}%'
            GROUP BY SUBSTR(SPRINT_HISTORY_DATE, 6, 2)
        `;
    }
            
    return query;
}

exports.selectLoginCount = (params) => {

    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(MEMBER_HISTORY_INDEX, 9, 2) day, COUNT(*) count
            FROM TBL_MEMBER_HISTORY
            WHERE MEMBER_HISTORY_INDEX LIKE '%${params.searchValue2.toString().substr(0, 7)}%'
                AND MEMBER_CODE != 6
            GROUP BY SUBSTR(MEMBER_HISTORY_INDEX, 9, 2);
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(MEMBER_HISTORY_INDEX, 6, 2) day, COUNT(*) count
            FROM TBL_MEMBER_HISTORY
            WHERE MEMBER_HISTORY_INDEX LIKE '%${params.searchValue2.toString().substr(0, 4)}%'
                AND MEMBER_CODE != 6
            GROUP BY SUBSTR(MEMBER_HISTORY_INDEX, 6, 2);
        `;
    }
            
    return query;
}

exports.selectVisitorCount = (params) => {

    let query = '';

    if(params.searchCondition === 'day') {
        
        query = `
            SELECT SUBSTR(MEMBER_HISTORY_INDEX, 9, 2) day, COUNT(DISTINCT MEMBER_CODE) count
            FROM TBL_MEMBER_HISTORY
            WHERE MEMBER_HISTORY_INDEX LIKE '%${params.searchValue2.toString().substr(0, 7)}%'
                AND MEMBER_CODE != 6
                AND MEMBER_HISTORY_ITEM = '로그인'
            GROUP BY SUBSTR(MEMBER_HISTORY_INDEX, 9, 2);
        `;
    }

    if(params.searchCondition === 'month') {

        query = `
            SELECT SUBSTR(MEMBER_HISTORY_INDEX, 6, 2) day, COUNT(DISTINCT MEMBER_CODE) count
            FROM TBL_MEMBER_HISTORY
            WHERE MEMBER_HISTORY_INDEX LIKE '%${params.searchValue2.toString().substr(0, 4)}%'
                AND MEMBER_CODE != 6
                AND MEMBER_HISTORY_ITEM = '로그인'
            GROUP BY SUBSTR(MEMBER_HISTORY_INDEX, 6, 2);
        `;
    }
            
    return query;
}

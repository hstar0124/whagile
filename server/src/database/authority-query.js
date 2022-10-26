exports.insertAuth = () => {

    let query = `
        INSERT INTO TBL_AUTHORITY (
              AUTHORITY_NAME
            , AUTHORITY_ACTIVATED_YN
            , AUTHORITY_EXPOSURE_ORDER
            , AUTHORITY_DESCRIPTION
            , AUTHORITY_DATE
        ) VALUES (
              ?
            , ?
            , ?
            , ?
            , DATE_FORMAT(SYSDATE(), '%Y-%m-%d %H:%i:%S')
        )
    `;

    return query;
};

exports.selectAuthHistory = (params) => {

    let query = `
        SELECT
              AUTHORITY_HISTORY_CODE
            , AUTHORITY_OCCURRENCE_DATE
            , AUTHORITY_HISTORY_OCCURRENCE
            , AUTHORITY_CODE
            , MEMBER_CODE
        FROM TBL_AUTHORITY_HISTORY
        WHERE 1 = 1
    `;
    
    if(params.authorityCode !== undefined) {
        query += `AND AUTHORITY_CODE = ${params.authorityCode}`;
    }

    if(params.projectCode !== undefined) {
        query += `AND MEMBER_CODE = ${params.memberCode}`;
    }

    if((   params.searchCondition === 'occurrence') 
        && params.searchValue !== undefined) { // 조건 검색
        query += `AND ${'AUTHORITY_HISTORY_' + params.searchCondition.toUpperCase()} LIKE '%${params.searchValue}%'`;
    }
    
    if((   params.orderCondition === 'code') 
        &&(params.orderValue.toLowerCase() === 'asc'
        || params.orderValue.toLowerCase() === 'desc')) { // 정렬
        query += `\nORDER BY ${'AUTHORITY_HISTORY_' + params.orderCondition.toUpperCase()} ${params.orderValue.toUpperCase()}`;
    }
    
    if(params.offset !== undefined && params.limit !== undefined) { // 페이징
        query += `\nLIMIT ${params.offset}, ${params.limit}`;
    }

    return query;
};

exports.selectAuths = (params) => {

    let query = `
        SELECT
              AUTHORITY_CODE
            , AUTHORITY_NAME
            , AUTHORITY_DESCRIPTION
            , AUTHORITY_ACTIVATED_YN
            , AUTHORITY_DATE
            , AUTHORITY_EXPOSURE_ORDER
        FROM TBL_AUTHORITY
        WHERE 
            AUTHORITY_DELETED_YN = 'N'
    `;
    
    if((   params.searchCondition === 'name'
        || params.searchCondition === 'description' 
        || params.searchCondition === 'activated_yn') 
        && params.searchValue !== undefined) { // 조건 검색
        query += `AND ${'AUTHORITY_' + params.searchCondition.toUpperCase()} LIKE '%${params.searchValue}%'`;
    }
    
    if((   params.orderCondition === 'code' 
        || params.orderCondition === 'name' 
        || params.orderCondition === 'date'
        || params.orderCondition === 'exposure_order') 
        &&(params.orderValue.toLowerCase() === 'asc'
        || params.orderValue.toLowerCase() === 'desc')) { // 정렬
        query += `\nORDER BY ${'AUTHORITY_' + params.orderCondition.toUpperCase()} ${params.orderValue.toUpperCase()}`;
    }
    
    if(params.offset !== undefined && params.limit !== undefined) { // 페이징
        query += `\nLIMIT ${params.offset}, ${params.limit}`;
    }

    return query;
};

exports.selectAuth = () => {

    let query = `
        SELECT
              AUTHORITY_CODE
            , AUTHORITY_NAME
            , AUTHORITY_DESCRIPTION
            , AUTHORITY_ACTIVATED_YN
            , AUTHORITY_DATE
            , AUTHORITY_EXPOSURE_ORDER
        FROM TBL_AUTHORITY
        WHERE 
            AUTHORITY_DELETED_YN = 'N'
            AND AUTHORITY_CODE = ?
    `;

    return query;
};

exports.updateAuth = () => {

    let query = `
        UPDATE TBL_AUTHORITY
        SET
              AUTHORITY_NAME = ?
            , AUTHORITY_ACTIVATED_YN = ?
            , AUTHORITY_EXPOSURE_ORDER = ?
            , AUTHORITY_DESCRIPTION = ?
        WHERE
            AUTHORITY_CODE = ?
    `;

    return query;
};

exports.deleteAuth = () => {

    let query = `
        UPDATE TBL_AUTHORITY
        SET
              AUTHORITY_DELETED_YN = 'Y'
            , AUTHORITY_ACTIVATED_YN = 'N'
            , AUTHORITY_EXPOSURE_ORDER = NULL
        WHERE
            AUTHORITY_CODE = ?
    `;

    return query;
};
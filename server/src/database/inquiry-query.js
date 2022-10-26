/* 1:1 문의 행 삽입 요청 SQL*/
exports.insertInquiry = () => {

    return `
        INSERT INTO TBL_INQUIRY 
        (INQUIRY_CREATED_DATE, INQUIRY_TITLE, INQUIRY_CONTENT, MEMBER_CODE, INQUIRY_CATEGORY_CODE)
        VALUES
        (DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?, ?, ?)
    `;
}

/* 1:1 문의 목록 조회 요청 SQL */
exports.selectInquiries = (memberCode, filter, searchValue, memberRole) => {

    let query = `
        SELECT
               A.INQUIRY_CODE
             , A.INQUIRY_TITLE
             , A.INQUIRY_CONTENT
             , A.INQUIRY_CREATED_DATE
             , A.INQUIRY_ANSWER_YN
             , A.INQUIRY_CATEGORY_CODE
             , B.INQUIRY_CATEGORY_NAME
             , A.MEMBER_CODE
             , C.MEMBER_NAME
          FROM TBL_INQUIRY A
          JOIN TBL_INQUIRY_CATEGORY B ON (A.INQUIRY_CATEGORY_CODE = B.INQUIRY_CATEGORY_CODE)
          JOIN TBL_MEMBER C ON (A.MEMBER_CODE = C.MEMBER_CODE)
         WHERE A.INQUIRY_DELETED_YN = 'N'
    `;

    if (memberRole === 'ROLE_USER') {
        query += `     AND A.MEMBER_CODE = ${ memberCode }
        `;
    }

    if (filter && filter !== undefined) {
        query += `     AND A.INQUIRY_ANSWER_YN = '${ filter }'
        `;
    }
    
    if (searchValue && searchValue !== undefined) {
        query += `     AND A.INQUIRY_TITLE LIKE '%${ searchValue }%'
        `;
    }

    query += `ORDER BY A.INQUIRY_CODE DESC
         LIMIT ?, ?`;

    return query;
}

/* 1:1 문의 상세조회 요청 SQL */
exports.selectInquiry = () => {

    return `
        SELECT
               A.INQUIRY_CODE
             , A.INQUIRY_TITLE
             , A.INQUIRY_CONTENT
             , A.INQUIRY_CREATED_DATE
             , A.INQUIRY_ANSWER_YN
             , A.INQUIRY_CATEGORY_CODE
             , B.INQUIRY_CATEGORY_NAME
             , A.MEMBER_CODE
             , C.MEMBER_NAME
          FROM TBL_INQUIRY A
          JOIN TBL_INQUIRY_CATEGORY B ON (A.INQUIRY_CATEGORY_CODE = B.INQUIRY_CATEGORY_CODE)
          JOIN TBL_MEMBER C ON (A.MEMBER_CODE = C.MEMBER_CODE)
         WHERE A.INQUIRY_CODE = ?
    `;
};

/* 1:1 문의 수정 요청 SQL */
exports.updateInquiry = (modifiedInquiry) => {
    
    let query = `
        UPDATE TBL_INQUIRY A
           SET
    `;
    
    if (modifiedInquiry.title) {
        query += `
         A.INQUIRY_TITLE = '${ modifiedInquiry.title }',`;
    }

    if (modifiedInquiry.content) {
        query += `
         A.INQUIRY_CONTENT = '${ modifiedInquiry.content }',`;
    }

    if (typeof(modifiedInquiry.categoryCode) == 'number') {
        query += `
         A.INQUIRY_CATEGORY_CODE = '${ modifiedInquiry.categoryCode }',`;
    }

    query = query.slice(0, -1);
    query += `
     WHERE A.INQUIRY_CODE = ${ modifiedInquiry.inquiryCode }
    `;

    return query;
}

/* 1:1 문의 삭제상태 변경 요청 SQL */
exports.deleteInquiry = () => {

    return `
        UPDATE TBL_INQUIRY A
           SET A.INQUIRY_DELETED_YN = 'Y'
         WHERE A.INQUIRY_CODE = ?
    `;
};

/* 1:1 문의히스토리 행 삽입 요청 SQL */
exports.insertInquiryHistory = () => {

    return `
        INSERT INTO TBL_INQUIRY_HISTORY
        (INQUIRY_HISTORY_DATE, INQUIRY_HISTORY_CONTENT, INQUIRY_CONTENT_SNAPSHOT, INQUIRY_CODE, MEMBER_CODE)
        VALUES
        (DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'), ?, ?, ?, ?)
    `;
}

/* 1:1 문의 답변 등록 여부 변경 요청 SQL */
exports.updateAnsweredStatus = () => {

    return `
        UPDATE TBL_INQUIRY A
           SET A.INQUIRY_ANSWER_YN = ?
         WHERE A.INQUIRY_CODE = ?
    `;
};
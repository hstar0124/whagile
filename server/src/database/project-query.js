/* 프로젝트 목록 조회 */
exports.selectProjects = (params) => {

    let query = 
      `
       SELECT
              A.*
            , (SELECT
                      COUNT(BK.BACKLOG_CODE)
                 FROM TBL_BACKLOG BK
                WHERE BK.BACKLOG_CATEGORY = '일감'
                  AND BK.BACKLOG_DELETED_YN = 'N'
                  AND BK.BACKLOG_PROGRESS_STATUS = '완료'
                  AND BK.PROJECT_CODE = B.PROJECT_CODE
                  AND BK.BACKLOG_CHARGER_CODE = ${ params.loginMember }
              ) COMPLETED_TASK
            , (SELECT 
                      COUNT(BK.BACKLOG_CODE)
                 FROM TBL_BACKLOG BK
                WHERE BK.BACKLOG_CATEGORY = '일감'
                  AND BK.BACKLOG_DELETED_YN = 'N'
                  AND BK.PROJECT_CODE = B.PROJECT_CODE
                  AND BK.BACKLOG_CHARGER_CODE = ${ params.loginMember }
              ) TOTAL_TASK
            , (SELECT
                      M.MEMBER_NAME
                 FROM TBL_PROJECT_MEMBER PM
                 JOIN TBL_MEMBER M ON(PM.MEMBER_CODE = M.MEMBER_CODE)
                WHERE PM.PROJECT_CODE = B.PROJECT_CODE
                  AND PM.AUTHORITY_CODE = 1
              ) PROJECT_OWNER
         FROM TBL_PROJECT A
         JOIN TBL_PROJECT_MEMBER B ON (A.PROJECT_CODE = B.PROJECT_CODE)
         JOIN TBL_MEMBER C ON (B.MEMBER_CODE = C.MEMBER_CODE)
        WHERE A.PROJECT_DELETED_STATUS = 'N'
          AND C.MEMBER_CODE = ${ params.loginMember }
      `;

    if(params.searchValue !== undefined) {
       query += ` AND ${'A.PROJECT_NAME'} LIKE '%${params.searchValue}%'`;
    }

    query += `ORDER BY A.PROJECT_CODE DESC`;
    return query;
};

/* 프로젝트 상세 조회 */
exports.selectProjectWithProjectCode = (projectCode) => {
    return `
        SELECT
               A.PROJECT_CODE
             , A.PROJECT_NAME
             , A.PROJECT_DESCRIPTION
             , (SELECT
                       M.MEMBER_CODE
                  FROM TBL_PROJECT_MEMBER PM
                  JOIN TBL_MEMBER M ON(PM.MEMBER_CODE = M.MEMBER_CODE)
                 WHERE PM.PROJECT_CODE = A.PROJECT_CODE
                   AND PM.AUTHORITY_CODE = 1
              ) PROJECT_OWNER_CODE
             , (SELECT
                       M.MEMBER_NAME
                  FROM TBL_PROJECT_MEMBER PM
                  JOIN TBL_MEMBER M ON(PM.MEMBER_CODE = M.MEMBER_CODE)
                 WHERE PM.PROJECT_CODE = A.PROJECT_CODE
                   AND PM.AUTHORITY_CODE = 1
                ) PROJECT_OWNER
          FROM TBL_PROJECT A
         WHERE A.PROJECT_CODE = ${ projectCode }
           AND A.PROJECT_DELETED_STATUS = 'N'
    `;
}

/* 프로젝트 추가 */
exports.insertProject = () => {
    return `
        INSERT
          INTO TBL_PROJECT
        (
          PROJECT_NAME
        , PROJECT_DESCRIPTION
        )
          VALUES
        (
          ?
        , ?
        )
    `;
}

/* 프로젝트 멤버 추가 */
exports.insertProjectMember = () => {
  return `
      INSERT
        INTO TBL_PROJECT_MEMBER
      (
        MEMBER_CODE
      , AUTHORITY_CODE
      , PROJECT_CODE
      )
        VALUES
      (
        ?
      , ?
      , ?
      )
  `;
}

exports.restoreProjectMember = (params) => {
  return `
      UPDATE TBL_PROJECT_MEMBER A
         SET A.PROJECT_MEMBER_DELETED_YN = 'N'
       WHERE A.PROJECT_CODE = ${params.projectCode}
         AND A.MEMBER_CODE = ${params.memberCode}
`
}


/* 프로젝트 수정 */
exports.updateProject = () => {
  return `
      UPDATE TBL_PROJECT A
         SET 
             A.PROJECT_NAME = ?
           , A.PROJECT_DESCRIPTION = ?
       WHERE A.PROJECT_CODE = ?
  `;
}

/* 기존 프로젝트 매니저 강등 */
exports.updateProjectOwner1 = () => {
  return `
     UPDATE 
            TBL_PROJECT_MEMBER A
        SET
            A.AUTHORITY_CODE = 2
      WHERE A.PROJECT_CODE = ?
        AND AUTHORITY_CODE = 1
  `;
}
/* 프로젝트 매니저 변경 */
exports.updateProjectOwner2 = () => {
  return `
    UPDATE TBL_PROJECT_MEMBER B
       SET
           B.AUTHORITY_CODE = 1
     WHERE B.PROJECT_CODE = ?
       AND B.MEMBER_CODE = ?
  `;
}

/* 프로젝트 매니저 변경 */
exports.updateProjectOwner = (projectInfo) => {
  return `
      INSERT
        INTO TBL_PROJECT_MEMBER
      (
        PROJECT_CODE
      , MEMBER_CODE
      , AUTHORITY_CODE
      )
      VALUES
        (${ projectInfo.projectCode }, (SELECT A.MEMBER_CODE FROM TBL_PROJECT_MEMBER WHERE A.PROJECT_CODE = ${projectInfo.projectCode} AND A.AUTHORITY_CODE = 1), 1)
      , (${ projectInfo.projectCode }, ${ projectInfo.projectOwner }, 2)
      ON DUPLICATE KEY UPDATE
        PROJECT_CODE = VALUES(PROJECT_CODE)
      , MEMBER_CODE = VALUES(MEMBER_CODE)
      , AUTHORITY_CODE = VALUES( AUTHORITY_CODE)
  `;
}

exports.deleteProject = () => {
  return `
    UPDATE TBL_PROJECT A
       SET
           A.PROJECT_DELETED_STATUS = 'Y'
     WHERE A.PROJECT_CODE = ?
  `;
}

exports.selectProjectMembers = (projectCode) => {
  return `
    SELECT
           A.MEMBER_CODE
         , B.MEMBER_ID
         , B.MEMBER_NAME
         , B.MEMBER_EMAIL
         , A.AUTHORITY_CODE
         , C.AUTHORITY_NAME
      FROM TBL_PROJECT_MEMBER A
      JOIN TBL_MEMBER B ON (A.MEMBER_CODE = B.MEMBER_CODE)
      JOIN TBL_AUTHORITY C ON (A.AUTHORITY_CODE = C.AUTHORITY_CODE)
     WHERE A.PROJECT_CODE = ${ projectCode }
       AND A.PROJECT_MEMBER_DELETED_YN = 'N'
  `
}

/* 프로젝트 멤버 삭제 */
exports.deleteProjectMember = (params) => {

  return `UPDATE TBL_PROJECT_MEMBER A
             SET A.PROJECT_MEMBER_DELETED_YN = 'Y'
           WHERE A.PROJECT_CODE = ${params.projectCode}
             AND A.MEMBER_CODE = ${params.memberCode}
         `
}

exports.isRegistedMember = (data) => {
  
  let query = `SELECT
                      A.*
                 FROM TBL_MEMBER A
                WHERE A.MEMBER_EMAIL = '${ data[0].address }'`

  if(data.length > 1 ) {
    for(let i = 1; i < data.length; i++) {
      query += `UNION
               SELECT
                      B.*
                  FROM TBL_MEMBER B
                 WHERE B.MEMBER_EMAIL = '${ data[i].address }'` 
    }
  };

  return query;

  }

  exports.updateMemberEmailAuthApporovedStatus = (memberCode) => {

    return `
        UPDATE
                TBL_MEMBER A
            SET 
                A.MEMBER_EMAIL_AUTH = 'Y'
          WHERE A.MEMBER_CODE = ${ memberCode }
    `;
  }

  exports.updateAuthorityOfMember = (projectMemberInfo) => {

    return `
        UPDATE
               TBL_PROJECT_MEMBER A
           SET
               A.AUTHORITY_CODE = ${ projectMemberInfo.authorityCode }
         WHERE A.MEMBER_CODE = ${ projectMemberInfo.memberCode }
           AND A.PROJECT_CODE = ${ projectMemberInfo.projectCode }
    `;
  }

  exports.selectProjectMember = (projectMemberInfo) => {

    return `
        SELECT
               A.MEMBER_CODE
             , B.MEMBER_ID
             , B.MEMBER_NAME
             , B.MEMBER_EMAIL
             , A.AUTHORITY_CODE
             , C.AUTHORITY_NAME
          FROM TBL_PROJECT_MEMBER A
          JOIN TBL_MEMBER B ON (A.MEMBER_CODE = B.MEMBER_CODE)
          JOIN TBL_AUTHORITY C ON (A.AUTHORITY_CODE = C.AUTHORITY_CODE)
         WHERE A.PROJECT_CODE = ${ projectMemberInfo.projectCode }
           AND A.MEMBER_CODE = ${ projectMemberInfo.memberCode }
    `;
  }

  exports.selectNotice = (projectCode) => {
    return `
        SELECT
               A.NOTICE_CODE
             , A.NOTICE_CONTENT
             , A.NOTICE_CREATED_DATE
             , A.PROJECT_CODE
             , A.CREATOR
             , A.MODIFIER
          FROM TBL_NOTICE A
         WHERE A.PROJECT_CODE = ${ projectCode }  
    `;
  };

  exports.insertNoticeToProject = () => {
    // console.log('noticeInfo', noticeInfo);
    return `
        INSERT
          INTO TBL_NOTICE
        (
          NOTICE_CONTENT
        , NOTICE_CREATED_DATE
        , CREATOR
        , PROJECT_CODE
        )
          VALUES
        (
          ?
        , ?
        , ?
        , ?
        )
    `;
  }

  exports.modifyNoticeToProject = (noticeInfo) => {

    return `
        UPDATE TBL_NOTICE
           SET
               NOTICE_CONTENT = '${ noticeInfo.content }'
             , MODIFIER = ${ noticeInfo.modifier }
         WHERE NOTICE_CODE = ${ noticeInfo.noticeCode }
    `;
  }

  exports.insertProjectHistory = () => {

    return `
        INSERT
          INTO TBL_PROJECT_HISTORY A 
        (
          A.PROJECT_HISTORY_NAME
        , A.PROJECT_HISTORY_CONTENT
        , A.PROJECT_HISTORY_DATE
        , A.PROJECT_CODE
        , A.MEMBER_CODE
        )
         VALUES
        (
          ?
        , ?
        , NOW()
        , ?
        , ?
        )
    `;
  }
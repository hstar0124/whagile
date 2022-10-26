  /* 프로젝트 별 진행상태에 따른 일감 개수 조회 */
  exports.selectCountingTaskByProgressStatus = (projectCode) => {
    console.log('qr', projectCode);
    return `
        SELECT
              (SELECT
                      COUNT(BK.BACKLOG_CODE)
                FROM TBL_BACKLOG BK
                WHERE BK.BACKLOG_CATEGORY = '일감'
                  AND BK.BACKLOG_PROGRESS_STATUS = '진행 전'
                  AND BK.BACKLOG_DELETED_YN = 'N'
                  AND BK.PROJECT_CODE = ${ projectCode }
              ) PENDING_TASK
            , (SELECT
                      COUNT(BK.BACKLOG_CODE)
                FROM TBL_BACKLOG BK
                WHERE BK.BACKLOG_CATEGORY = '일감'
                  AND BK.BACKLOG_PROGRESS_STATUS = '진행 중'
                  AND BK.BACKLOG_DELETED_YN = 'N'
                  AND BK.PROJECT_CODE = ${ projectCode }
              ) PROGRESSING_TASK
            , (SELECT
                      COUNT(BK.BACKLOG_CODE)
                FROM TBL_BACKLOG BK
                WHERE BK.BACKLOG_CATEGORY = '일감'
                  AND BK.BACKLOG_PROGRESS_STATUS = '완료'
                  AND BK.BACKLOG_DELETED_YN = 'N'
                  AND BK.PROJECT_CODE = ${ projectCode }
              ) COMPLETED_TASK
            , (SELECT 
                      COUNT(BK.BACKLOG_CODE)
                FROM TBL_BACKLOG BK
                WHERE BK.BACKLOG_CATEGORY = '일감'
                  AND (BK.BACKLOG_PROGRESS_STATUS = "진행 전" 
                  OR BK.BACKLOG_PROGRESS_STATUS = "진행 중"
                  OR BK.BACKLOG_PROGRESS_STATUS = "완료"
                  )
                  AND BK.BACKLOG_DELETED_YN = 'N'
                  AND BK.PROJECT_CODE = ${ projectCode }
              ) TOTAL_TASK;
    `;
  }

  exports.selectBacklogCountToProject = () => {
    return `
        SELECT
             , (SELECT 
                       COUNT(BK.BACKLOG_CODE)
                   FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '백로그'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.PROJECT_CODE = 1
                   AND BK.BACKLOG_ISSUE = 0
               ) DEFAULT_BACKLOG_COUNT
             , (SELECT 
                       COUNT(BK.BACKLOG_CODE)
                   FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '백로그'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.PROJECT_CODE = 1
                   AND BK.BACKLOG_ISSUE = 1
               ) ISSUE_BACKLOG_COUNT
             , (SELECT 
                       COUNT(BK.BACKLOG_CODE)
                   FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '백로그'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.PROJECT_CODE = 1
               ) TOTAL_BACKLOG_COUNT;
    `;
  }

  exports.selectTaskCountToSprint = () => {

    return `
        SELECT
               ( SELECT
                       COUNT(BK.BACKLOG_CODE)
                 FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '일감'
                   AND BK.BACKLOG_PROGRESS_STATUS = '진행 전'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.SPRINT_CODE = 1
               ) PENDING_TASK_COUNT_IN_SPRINT
             , ( SELECT
                       COUNT(BK.BACKLOG_CODE)
                 FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '일감'
                   AND BK.BACKLOG_PROGRESS_STATUS = '진행 중'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.SPRINT_CODE = 1
               ) PROGRESSING_TASK_COUNT_IN_SPRINT
             , ( SELECT
                       COUNT(BK.BACKLOG_CODE)
                 FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '일감'
                   AND BK.BACKLOG_PROGRESS_STATUS = '완료'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.SPRINT_CODE = 1
               ) COMPLETED_TASK_COUNT_IN_SPRINT
             , ( SELECT
                       COUNT(BK.BACKLOG_CODE)
                 FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '일감'
                   AND (BK.BACKLOG_PROGRESS_STATUS = "진행 전" 
                   OR BK.BACKLOG_PROGRESS_STATUS = "진행 중"
                   OR BK.BACKLOG_PROGRESS_STATUS = "완료"
                   )
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.SPRINT_CODE = 1
               ) TOTAL_TASK_COUNT_IN_SPRINT;
    `;
  }

  exports.selectTaskCountPerMember = () => {

    return `
        SELECT
               M.MEMBER_CODE 
             , M.MEMBER_NAME
             , (SELECT
                       COUNT(BK.BACKLOG_CODE)
                  FROM TBL_BACKLOG BK
                 WHERE BK.BACKLOG_CATEGORY = '일감'
                   AND BK.BACKLOG_DELETED_YN = 'N'
                   AND BK.PROJECT_CODE = P.PROJECT_CODE
                   AND BK.BACKLOG_CHARGER_CODE = P.MEMBER_CODE
                   AND NOT BK.BACKLOG_PROGRESS_STATUS = '완료'
                   AND NOT BK.BACKLOG_PROGRESS_STATUS = '백로그'
                ) MEMBER_DOING_TASK
          FROM TBL_PROJECT_MEMBER P
          JOIN TBL_MEMBER M ON (P.MEMBER_CODE = M.MEMBER_CODE)
        WHERE P.PROJECT_CODE = 1;
    `;
  }
  
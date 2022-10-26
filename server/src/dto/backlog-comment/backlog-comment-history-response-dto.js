class BacklogCommentHistoryDTO {

    historyCode;
    historyType;
    historyDate;
    modifiedComment;
    backlogCommentCode;
    projectCode;
    memberCode;

    constructor(data) {
        this.historyCode = data.BACKLOG_COMMENT_HISTORY_CODE;
        this.historyType = data.BACKLOG_COMMENT_HISTORY_CONTENT;
        this.historyDate = data.BACKLOG_HISTORY_DATE;
        this.modifiedComment = data.BACKLOG_MODIFIED_COMMENT_DETAIL;
        this.backlogCommentCode = data.BACKLOG_COMMENT_CODE;
        this.projectCode = data.PROJECT_CODE;
        this.memberCode = data.MEMBER_CODE;
    }
}

module.exports = BacklogCommentHistoryDTO;
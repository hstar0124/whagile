class BacklogDTO {

    backlogCode;
    backlogTitle;
    category;
    progressStatus;
    urgency;
    issue;
    projectCode;
    creatorCode;
    memberName;

    constructor(data) {
        this.backlogCode = data.BACKLOG_CODE;
        this.backlogTitle = data.BACKLOG_TITLE;
        this.category = data.BACKLOG_CATEGORY;
        this.progressStatus = data.BACKLOG_PROGRESS_STATUS;
        this.urgency = data.BACKLOG_URGENCY;
        this.issue = data.BACKLOG_ISSUE;
        this.projectCode = data.PROJECT_CODE;
        this.creatorCode = data.BACKLOG_CREATOR_CODE;
        this.memberName = data.MEMBER_NAME;
    };
}

module.exports = BacklogDTO;
class BacklogDatailDTO {

    backlogCode;
    title;
    description;
    category;
    progressStatus;
    urgency;
    issue;
    creatorCode;
    creatorName;
    chargerCode;
    chargerName;
    projectCode;
    sprintCode;
    sprintName;
    deletedYN;

    constructor(data) {
        this.backlogCode = data.BACKLOG_CODE;
        this.title = data.BACKLOG_TITLE;
        this.description = data.BACKLOG_DESCRIPTION;
        this.category = data.BACKLOG_CATEGORY;
        this.progressStatus = data.BACKLOG_PROGRESS_STATUS;
        this.urgency = data.BACKLOG_URGENCY;
        this.issue = data.BACKLOG_ISSUE;
        this.creatorCode = data.BACKLOG_CREATOR_CODE;
        this.creatorName = data.CREATOR_NAME;
        this.chargerCode = data.CHARGER_CODE;
        this.chargerName = data.CHARGER_NAME;
        this.projectCode = data.PROJECT_CODE;
        this.sprintCode = data.SPRINT_CODE;
        this.sprintName = data.SPRINT_NAME;
        this.deletedYN = data.BACKLOG_DELETED_YN;
    };
}

module.exports = BacklogDatailDTO;
class BacklogHistoryDTO {

    historyCode;
    historyItem;
    historyContent;
    historyDate;
    backlogCode;
    projectCode;
    memberCode;

    constructor(data) {
        this.historyCode = data.BACKLOG_HISTORY_CODE;
        this.historyItem = data.BACKLOG_HISTORY_ITEM;
        this.historyContent = data.BACKLOG_HISTORY_CONTENT;
        this.historyDate = data.BACKLOG_HISTORY_DATE;
        this.backlogCode = data.BACKLOG_CODE;
        this.projectCode = data.PROJECT_CODE;
        this.memberCode = data.MEMBER_CODE;
    }
}

module.exports = BacklogHistoryDTO;
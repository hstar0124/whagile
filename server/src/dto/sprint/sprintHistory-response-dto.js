class SprintHistoryDTO {
    sprintHistoryCode;
    sprintHistoryItem;
    sprintHistoryContent;
    sprintHistoryDate;
    sprintCode;
    memberCode;
    projectCode;
    
    constructor(data) {
        this.sprintHistoryCode = data.SPRINT_HISTORY_CODE;
        this.sprintHistoryItem = data.SPRINT_HISTORY_ITEM;
        this.sprintHistoryContent = data.SPRINT_HISTORY_CONTENT;
        this.sprintHistoryDate = data.SPRINT_HISTORY_DATE;
        this.sprintCode = data.SPRINT_CODE;
        this.memberCode = data.MEMBER_CODE;
        this.projectCode = data.PROJECT_CODE;
    }
}

module.exports = SprintHistoryDTO;
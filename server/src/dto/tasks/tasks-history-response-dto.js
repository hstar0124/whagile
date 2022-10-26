class TasksHistoryDTO {
  historyCode;
  historyItem;
  historyContent;
  historyDate;
  taskCode;
  projectCode;
  memberCode;

  constructor(data) {
    this.historyCode = data.BACKLOG_HISTORY_CODE;
    this.historyItem = data.BACKLOG_HISTORY_ITEM;
    this.historyContent = data.BACKLOG_HISTORY_CONTENT;
    this.historyDate = data.BACKLOG_HISTORY_DATE;
    this.taskCode = data.BACKLOG_CODE;
    this.projectCode = data.PROJECT_CODE;
    this.memberCode = data.MEMBER_CODE;
  }
}

module.exports = TasksHistoryDTO;

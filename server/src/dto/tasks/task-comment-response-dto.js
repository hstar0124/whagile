class TaskCommentDTO {
  taskCommentCode;
  taskCommentContent;
  taskCommentCreatedDate;
  taskCommentModifiedDate;
  taskCommentModifiedYN;
  taskCommentDeletedYN;
  taskCode;
  projectCode;
  memberCode;
  memberName;

  constructor(data) {
    this.taskCommentCode = data.BACKLOG_COMMENT_CODE;
    this.taskCommentContent = data.BACKLOG_COMMENT_CONTENT;
    this.taskCommentCreatedDate = data.BACKLOG_COMMENT_CREATED_DATE;
    this.taskCommentModifiedDate = data.BACKLOG_COMMENT_MODIFIED_DATE;
    this.taskCommentModifiedYN = data.BACKLOG_COMMENT_MODIFIED_YN;
    this.taskCommentDeletedYN = data.BACKLOG_COMMENT_DELETED_YN;
    this.taskCode = data.BACKLOG_CODE;
    this.projectCode = data.PROJECT_CODE;
    this.memberCode = data.MEMBER_CODE;
    this.memberName = data.MEMBER_NAME;
  }
}

module.exports = TaskCommentDTO;

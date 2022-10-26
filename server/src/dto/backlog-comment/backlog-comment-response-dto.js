class BacklogCommentDTO {

    backlogCommentCode;
    content;
    createdDate;
    modifiedDate;
    modifiedYN;
    deletedYN;
    backlogCode;
    projectCode;
    memberCode;
    memberName;

    constructor(data) {
        this.backlogCommentCode = data.BACKLOG_COMMENT_CODE;
        this.content = data.BACKLOG_COMMENT_CONTENT;
        this.createdDate = data.BACKLOG_COMMENT_CREATED_DATE;
        this.modifiedDate = data.BACKLOG_COMMENT_MODIFIED_DATE;
        this.modifiedYN = data.BACKLOG_COMMENT_MODIFIED_YN;
        this.deletedYN = data.BACKLOG_COMMENT_DELETED_YN;
        this.backlogCode = data.BACKLOG_CODE;
        this.projectCode = data.PROJECT_CODE;
        this.memberCode = data.MEMBER_CODE;
        this.memberName = data.MEMBER_NAME;
    }
}

module.exports = BacklogCommentDTO;
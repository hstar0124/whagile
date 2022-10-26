class InquiryCommentDTO {
    
    inquiryCommentCode;
    content;
    modifiedDate;
    modifiedYN;
    inquiryCode;
    memberCode;
    memberName;

    constructor(data) {
        this.inquiryCommentCode = data.INQUIRY_COMMENT_CODE;
        this.content = data.INQUIRY_COMMENT_CONTENT;
        this.modifiedDate = data.INQUIRY_COMMENT_MODIFIED_DATE;
        this.modifiedYN = data.INQUIRY_COMMENT_MODIFIED_YN;
        this.inquiryCode = data.INQUIRY_CODE;
        this.memberCode = data.MEMBER_CODE;
        this.memberName = data.MEMBER_NAME;
    }
}

module.exports = InquiryCommentDTO;
class InquiryDTO {

    inquiryCode;
    title;
    content;
    createdDate;
    answeredYN;
    categoryCode;
    categoryName;
    memberCode;
    memberName;

    constructor(data) {
        this.inquiryCode = data.INQUIRY_CODE;
        this.title = data.INQUIRY_TITLE;
        this.content = data.INQUIRY_CONTENT;
        this.createdDate = data.INQUIRY_CREATED_DATE;
        this.answeredYN = data.INQUIRY_ANSWER_YN;
        this.categoryCode = data.INQUIRY_CATEGORY_CODE;
        this.categoryName = data.INQUIRY_CATEGORY_NAME;
        this.memberCode = data.MEMBER_CODE;
        this.memberName = data.MEMBER_NAME;
    }
}

module.exports = InquiryDTO;
class MemberDTO {
    memberCode;
    memberId;
    password;
    email;
    phone;
    createDate;
    role;
    secession;
    company;
    occupation;
    purpose;
    name;
    emailAuth;

    
    constructor(data) {
        this.memberCode = data.MEMBER_CODE;
        this.memberId = data.MEMBER_ID;
        this.password = data.MEMBER_PASSWORD;
        this.email = data.MEMBER_EMAIL;
        this.phone = data.MEMBER_PHONE;
        this.createDate = data.MEMBER_CREATED_DATE;
        this.role = data.MEMBER_ROLE;
        this.secession = data.MEMBER_SECESSION_YN;
        this.company = data.MEMBER_COMPANY;
        this.occupation = data.MEMBER_OCCUPATION;
        this.purpose = data.MEMBER_PURPOSE;
        this.name = data.MEMBER_NAME;
        this.emailAuth = data.MEMBER_EMAIL_AUTH;
    }
}

module.exports = MemberDTO;
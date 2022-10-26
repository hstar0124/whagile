class ProjectMemberDTO {
    memberId;
    memberCode;     //프로젝트 구성원 번호
    memberName;     //프로젝트 구성원 이름
    memberEmail;
    authorityCode;  //권한 번호
    authorityName;  //권한 이름
    
    constructor(data) {
        this.memberCode = data.MEMBER_CODE;
        this.memberId = data.MEMBER_ID;
        this.memberName = data.MEMBER_NAME;
        this.memberEmail = data.MEMBER_EMAIL;
        this.authorityCode = data.AUTHORITY_CODE;
        this.authorityName = data.AUTHORITY_NAME;
    }
}

module.exports = ProjectMemberDTO;
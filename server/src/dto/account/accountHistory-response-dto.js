class MemberHistoryDTO {
    memberCode;
    memberName;
    modifyDate;
    index; 
    item;

    constructor(data) {
        this.memberCode = data.MEMBER_CODE;
        this.memberName = data.MEMBER_NAME;
        this.modifyDate = data.MODIFY_DATE;
        this.index = data.INDEX;
        this.item = data.ITEM;
    }
}

module.exports = MemberHistoryDTO;
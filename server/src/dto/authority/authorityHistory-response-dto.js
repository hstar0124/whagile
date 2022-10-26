class AuthorityHistoryDTO {

    authorityHistoryCode;
    authorityOccurrenceDate;
    authorityHistoryOccurrence;
    authorityCode;
    memberCode;
    
    constructor(data) {

        this.authorityHistoryCode = data.AUTHORITY_HISTORY_CODE;
        this.authorityOccurrenceDate = data.AUTHORITY_OCCURRENCE_DATE;
        this.authorityHistoryOccurrence = data.AUTHORITY_HISTORY_OCCURRENCE;
        this.authorityCode = data.AUTHORITY_CODE;
        this.memberCode = data.MEMBER_CODE;
    }
}

module.exports = AuthorityHistoryDTO;
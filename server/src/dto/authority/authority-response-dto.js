class AuthorityDTO {

    authorityCode;
    authorityName;
    authorityDescription;
    authorityActivatedYn;
    authorityDate;
    authorityExposureDate;
    
    constructor(data) {
        
        this.authorityCode = data.AUTHORITY_CODE;
        this.authorityName = data.AUTHORITY_NAME;
        this.authorityDescription = data.AUTHORITY_DESCRIPTION;
        this.authorityActivatedYn = data.AUTHORITY_ACTIVATED_YN;
        this.authorityDate = data.AUTHORITY_DATE;
        this.authorityExposureOrder = data.AUTHORITY_EXPOSURE_ORDER;
    }
}

module.exports = AuthorityDTO;
class SprintDTO {
    sprintCode;
    sprintName;
    sprintTarget;
    sprintStartDate;
    sprintEndDate;
    sprintProgressStatus;
    sprintDeletedYn;
    projectCode;
    
    constructor(data) {
        this.sprintCode = data.SPRINT_CODE;
        this.sprintName = data.SPRINT_NAME;
        this.sprintTarget = data.SPRINT_TARGET;
        this.sprintStartDate = data.SPRINT_START_DATE;
        this.sprintEndDate = data.SPRINT_END_DATE;
        this.sprintProgressStatus = data.SPRINT_PROGRESS_STATUS;
        this.sprintDeletedYn = data.SPRINT_DELETED_YN;
        this.projectCode = data.PROJECT_CODE;
    }
}

module.exports = SprintDTO;
class ProjectDTO {
    projectCode;            //프로젝트 번호
    projectName;            //프로젝트 이름
    projectDescription;     //프로젝트 설명
    projectCompletedTask    //완료한 할일
    projectTotalTask        //전체 할일
    projectDeletedStatus;   //프로젝트 삭제여부
    projectOwner            //프로젝트 매니저
    projectOwnerCode
    remainedTask            //남은 할일 / 전체 할일
    
    constructor(data) {
        this.projectCode = data.PROJECT_CODE;
        this.projectName = data.PROJECT_NAME;
        this.projectDescription = data.PROJECT_DESCRIPTION;
        this.projectCompletedTask = data.COMPLETED_TASK;
        this.projectTotalTask = data.TOTAL_TASK;
        this.remainedTask = data.COMPLETED_TASK + ' / ' + data.TOTAL_TASK;
        this.projectDeletedStatus = data.PROJECT_DELETED_STATUS
        this.projectOwner = data.PROJECT_OWNER;
        this.projectOwnerCode = data.PROJECT_OWNER_CODE;
    }
}

module.exports = ProjectDTO;
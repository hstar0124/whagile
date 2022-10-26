class ProjectStatisticsDTO {
    pendingTaskCntToProject;        //프로젝트 내 진행 전 일감 수
    progressingTaskCntToProject;    //프로젝트 내 진행 중 일감 수
    completedTaskCntToProject;      //프로젝트 내 완료한 일감 수
    totalTaskCntToProject;          //프로젝트 내 전체 일감 수

    constructor(data) {
        this.pendingTaskCntToProject = data.PENDING_TASK;
        this.progressingTaskCntToProject = data.PROGRESSING_TASK;
        this.completedTaskCntToProject = data.COMPLETED_TASK;
        this.totalTaskCntToProject = data.TOTAL_TASK;
    }
}

module.exports = ProjectStatisticsDTO;
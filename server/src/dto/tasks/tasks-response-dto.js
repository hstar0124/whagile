class TasksDTO {
  backlogCode; //백로그 번호
  backlogTitle; //백로그 제목
  backlogDescription; //백로그 설명
  issue; //이슈여부
  urgency; //긴급도
  progressStatus; //진행상태
  backlogChargerCode; //담당자 번호
  category; //백로그, 일감 구분
  projectCode; //프로젝트 번호
  sprintCode; //스프린트 번호
  creatorCode; //일감 생성자 번호
  memberCode; 
  memberName; //회원 이름
  startDate; //시작일
  endDate; //종료일

  constructor(data) {
    this.backlogCode = data.BACKLOG_CODE;
    this.backlogTitle = data.BACKLOG_TITLE;
    this.backlogDescription = data.BACKLOG_DESCRIPTION;
    this.issue = data.BACKLOG_ISSUE;
    this.urgency = data.BACKLOG_URGENCY;
    this.progressStatus = data.BACKLOG_PROGRESS_STATUS;
    this.backlogChargerCode = data.BACKLOG_CHARGER_CODE;
    this.category = data.BACKLOG_CATEGORY;
    this.projectCode = data.PROJECT_CODE;
    this.sprintCode = data.SPRINT_CODE;
    this.creatorCode = data.BACKLOG_CREATOR_CODE;
    this.memberName = data.MEMBER_NAME;
    this.memberCode = data.MEMBER_CODE;
    this.startDate = data.BACKLOG_START_DATE;
    this.endDate = data.BACKLOG_END_DATE;
  }
}

module.exports = TasksDTO;

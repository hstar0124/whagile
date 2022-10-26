import { combineReducers } from 'redux';
import adminStatisticsReducer from './AdminStatisticsModule';
import adminStatisticsChartReducer from './AdminStatisticsChartModule';
import authsReducer from './AuthsModule';
import authReducer from './AuthModule';
import authOrderReducer from './AuthOrderModule';
import backlogReducer from './BacklogModule';
import backlogDetailReducer from './BacklogDetailModule';
import backlogCommentReducer from './BacklogCommentModule';
import backlogCommentDetailReducer from './BacklogCommentDetailModule';
import projectsReducer from './ProjectModule';
import projectMemberReducer from './ProjectMemberModule';
import projectMembersReducer from './ProjectMembersModule';
import ProjectNoticeReducer from './ProjectNoticeModule';
import projectStatisticsReducer from './ProjectStatisticsModule';
import memberReducer from './MemberModule';
import tasksReducer from './TasksModule';
import taskReducer from './TaskModule';
import taskTotalCommentReducer from './TaskTotalCommentModule';
import taskCommentReducer from './TaskCommentModule';
import tasksSprintReducer from './TasksSprintModule';
import sprintBacklogsReducer from './SprintBacklogsModule';
import sprintTaskReducer from './SprintTaskModule';
import sprintsCountReducer from './SprintsCountModule';
import sprintsReducer from './SprintsModule';
import sprintReducer from './SprintModule';
import sprintsForBacklogReducer from './SprintsForBacklogModule';
import sprintForBacklogReducer from './SprintForBacklogModule';
import inquiriesReducer from './InquiriesModule';
import inquiryReducer from './InquiryModule';
import inquiryCommentReducer from './InquiryCommentModule';

const rootReducer = combineReducers({
    adminStatisticsReducer,
    adminStatisticsChartReducer,
    authsReducer,
    authReducer,
    authOrderReducer,
    memberReducer,
    backlogReducer,
    backlogDetailReducer,
    backlogCommentReducer,
    backlogCommentDetailReducer,
    projectsReducer,
    projectMemberReducer,
    projectMembersReducer,
    ProjectNoticeReducer,
    projectStatisticsReducer,
    tasksReducer,
    taskReducer,
    taskCommentReducer,
    taskTotalCommentReducer,
    tasksSprintReducer,
    sprintBacklogsReducer,
    sprintTaskReducer,
    sprintsCountReducer,
    sprintsReducer,
    sprintReducer,
    sprintsForBacklogReducer,
    sprintForBacklogReducer,
    inquiriesReducer,
    inquiryReducer,
    inquiryCommentReducer
});

export default rootReducer;

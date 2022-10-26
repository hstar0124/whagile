import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = {
    completedTaskCntToProject : {},
    pendingTaskCntToProject : {},
    progressingTaskCntToProject : {},
    totalTaskCntToProject : {}
};

/* 액션 */
export const GET_TASK_COUNT = 'projectStatistics/GET_TASK_COUNT';

const actions = createActions({

    [GET_TASK_COUNT]: () => {}
});

/* 리듀서 */
const projectStatisticsReducer = handleActions(
    {
        [GET_TASK_COUNT]: (state, { payload }) => {

            state.completedTaskCntToProject = payload.completedTaskCntToProject;
            state.pendingTaskCntToProject = payload.pendingTaskCntToProject;
            state.progressingTaskCntToProject = payload.progressingTaskCntToProject;
            state.totalTaskCntToProject = payload.totalTaskCntToProject;

            return {...state} 
        }
    },
    initialState
);

export default projectStatisticsReducer;
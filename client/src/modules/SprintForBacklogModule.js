import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const REGIST_SPRINT = 'backlog/REGIST_SPRINT';
export const MODIFY_SPRINT = 'backlog/MODIFY_SPRINT';
export const CHANGE_SPRINT_PROGRESS_STATUS = 'backlog/CHANGE_SPRINT_PROGRESS_STATUS';
export const REMOVE_SPRINT = 'backlog/REMOVE_SPRINT';

const actions = createActions({
    [REGIST_SPRINT]: () => {}, 
    [MODIFY_SPRINT]: () => {},
    [CHANGE_SPRINT_PROGRESS_STATUS]: () => {},
    [REMOVE_SPRINT]: () => {}
});

/* 리듀서 */
const sprintForBacklogReducer = handleActions(
    {
        [REGIST_SPRINT]: (state, { payload }) => {
            return payload;
        }, 
        [MODIFY_SPRINT]: (state, { payload }) => {
            return payload;
        },
        [CHANGE_SPRINT_PROGRESS_STATUS]: (state, { payload }) => {
            return payload;
        },
        [REMOVE_SPRINT]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);


export default sprintForBacklogReducer;
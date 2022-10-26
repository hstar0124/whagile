import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const FIND_SPRINTS = 'backlog/FIND_SPRINTS';
export const CLEAN_SPRINTS = 'backlog/CLEAN_SPRINTS';

const actions = createActions({
    [FIND_SPRINTS]: () => {},
    [CLEAN_SPRINTS]: () => {}
});

/* 리듀서 */
const sprintsForBacklogReducer = handleActions(
    {
        [FIND_SPRINTS]: (state, { payload }) => {
            return payload;
        }, 
        [CLEAN_SPRINTS]: (state, { payload }) => {
            state = initialState;    //초기 state값으로 clean up 한다
            return state;
        }
    },
    initialState
);


export default sprintsForBacklogReducer;
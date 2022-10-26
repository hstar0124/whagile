import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_BACKLOGS = 'sprintBacklogs/GET_BACKLOGS';

const actions = createActions({
    [GET_BACKLOGS]: () => {},
});

/* 리듀서 */
const sprintBacklogsReducer = handleActions(
    {
        [GET_BACKLOGS]: (state, { payload }) => {

            return payload;
        }
    },
    initialState
);

export default sprintBacklogsReducer;
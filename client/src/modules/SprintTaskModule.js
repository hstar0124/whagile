import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_SPRINT_TASK = 'sprintTask/GET_SPRINT_TASK';

const actions = createActions({
    [GET_SPRINT_TASK]: () => {},
});

/* 리듀서 */
const sprintTaskReducer = handleActions(
    {
        [GET_SPRINT_TASK]: (state, { payload }) => { 
            
            return payload;
        }
    },
    initialState
);


export default sprintTaskReducer;
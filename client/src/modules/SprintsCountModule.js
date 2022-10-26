import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_COUNT = 'sprint/GET_COUNT';

const actions = createActions({
    [GET_COUNT]: () => {},

});

/* 리듀서 */
const sprintsCountReducer = handleActions(
    {
        [GET_COUNT]: (state, { payload }) => {
            
            return payload;
        },
    },
    initialState
);

export default sprintsCountReducer;
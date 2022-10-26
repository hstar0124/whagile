import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = [];

/* 액션 */
export const GET_COUNTS = 'adminStatistics/GET_COUNTS';

const actions = createActions({
    [GET_COUNTS]: () => {}
});

/* 리듀서 */
const adminStatisticsReducer = handleActions(
    {
        [GET_COUNTS]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default adminStatisticsReducer;
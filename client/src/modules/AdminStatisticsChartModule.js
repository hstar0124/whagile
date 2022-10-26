import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = [];

/* 액션 */
export const GET_CHART_COUNTS = 'adminStatisticsChart/GET_CHART_COUNTS';

const actions = createActions({
    [GET_CHART_COUNTS]: () => {}
});

/* 리듀서 */
const adminStatisticsChartReducer = handleActions(
    {
        [GET_CHART_COUNTS]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default adminStatisticsChartReducer;
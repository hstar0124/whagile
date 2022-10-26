import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const FIND_BACKLOGS = 'backlog/FIND_BACKLOGS';
export const MORE_BACKLOGS = 'backlog/MORE_BACKLOGS';
export const FIND_FILTERED_BACKLOGS = 'backlog/FIND_FILTERED_BACKLOGS';
export const CLEAN_BACKLOG = 'backlog/CLEAN_BACKLOG';

const actions = createActions({
    [FIND_BACKLOGS]: () => {},
    [MORE_BACKLOGS]: () => {},
    [FIND_FILTERED_BACKLOGS]: () => {},
    [CLEAN_BACKLOG]: () => {}
});

/* 리듀서 */
const backlogReducer = handleActions(
    {
        [FIND_BACKLOGS]: (state, { payload }) => {
            return payload;
        }, 
        [MORE_BACKLOGS]: (state, { payload }) => {
            if(payload.length > 0) {
                return state.concat(payload);
            } else {
                alert('마지막 백로그까지 조회하였습니다.');
                return state;
            }
        },
        [FIND_FILTERED_BACKLOGS]: (state, { payload }) => {
            if(state.length > 0) {
                state = [];
            }
            return payload;
        },
        [CLEAN_BACKLOG]: (state, { payload }) => {
            state = initialState;    //초기 state값으로 clean up 한다
            return state;
        }
    },
    initialState
);

export default backlogReducer;
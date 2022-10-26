import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const FIND_BACKLOG_COMMENTS = 'backlog/FIND_BACKLOG_COMMENTS';
export const MORE_BACKLOG_COMMENTS = 'backlog/MORE_BACKLOG_COMMENTS';
export const CLEAN_BACKLOG_COMMENTS = 'backlog/CLEAN_BACKLOG_COMMENTS';

const actions = createActions({
    [FIND_BACKLOG_COMMENTS]: () => {},
    [MORE_BACKLOG_COMMENTS]: () => {},
    [CLEAN_BACKLOG_COMMENTS]: () => {}
});

/* 리듀서 */
const backlogCommentReducer = handleActions(
    {
        [FIND_BACKLOG_COMMENTS]: (state, { payload }) => {
            return payload;
        },
        [MORE_BACKLOG_COMMENTS]: (state, { payload }) => {
            if(payload.length > 0) {
                return state.concat(payload);
            }  else {
                alert('마지막 댓글까지 조회하였습니다.');
                return state;
            }
        },
        [CLEAN_BACKLOG_COMMENTS]: (state, { payload }) => {
            state = initialState;    //초기 state값으로 clean up 한다
            return state;
        }
    },
    initialState
);

export default backlogCommentReducer;
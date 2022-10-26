import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_MEMBER = 'account/GET_MEMBER';

const actions = createActions({
    [GET_MEMBER]: () => {}
});

/* 리듀서 */
const memberReducer = handleActions(
    {
        [GET_MEMBER]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default memberReducer;
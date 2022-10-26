import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_AUTHS = 'auths/GET_AUTHS';

const actions = createActions({
    [GET_AUTHS]: () => {},
});

/* 리듀서 */
const authsReducer = handleActions(
    {
        [GET_AUTHS]: (state, { payload }) => {
            return payload;
        },
    },
    initialState
);

export default authsReducer;
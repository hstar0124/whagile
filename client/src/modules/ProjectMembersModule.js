import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = [];

/* 액션 */
export const GET_PROJECT_MEMBER_INFO = 'projectMembers/GET_PROJECT_MEMBER_INFO';

const actions = createActions({

    [GET_PROJECT_MEMBER_INFO]: () => {}
});

/* 리듀서 */
export const projectMembersReducer = handleActions(
    {
        [GET_PROJECT_MEMBER_INFO]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default projectMembersReducer;
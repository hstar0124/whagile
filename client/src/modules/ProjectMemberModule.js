import { createActions, handleActions } from 'redux-actions';

/* 초기 값 */
const initialState = [];

/* 액션 */
export const GET_INVITED_MEMBER = 'projectMember/GET_INVITED_MEMBER';
export const GET_PROJECT_MEMBER = 'projectMember/GET_PROJECT_MEMBER';
export const PUT_MODIFY_AUTHORITY = 'projectMember/PUT_MODIFY_AUTHORITY';
export const DELETE_PROJECT_MEMBER = 'projectMember/DELETE_PROJECT_MEMBER';
export const GET_PROJECT_MEMBER_INFO = 'projectMember/GET_PROJECT_MEMBER_INFO';

const actions = createActions({

    [GET_INVITED_MEMBER]: () => {},
    [GET_PROJECT_MEMBER]: () => {},
    [PUT_MODIFY_AUTHORITY]: () => {},
    [DELETE_PROJECT_MEMBER]: () => {},
    [GET_PROJECT_MEMBER_INFO]: () => {}
});

/* 리듀서 */
export const projectMemberReducer = handleActions(
    {
        [GET_INVITED_MEMBER]: (state, { payload }) => {
            return payload;
        },
        [GET_PROJECT_MEMBER]: (state, { payload }) => {
            return payload;
        },
        [PUT_MODIFY_AUTHORITY]: (state, { payload }) => {
            return payload;
        },
        [DELETE_PROJECT_MEMBER]: (state, { payload }) => {
            return payload;
        },
        [GET_PROJECT_MEMBER_INFO]: (state, { payload }) => {
            return payload;
        }
    },
    initialState
);

export default projectMemberReducer;
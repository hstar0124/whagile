import { createActions, handleActions } from 'redux-actions';

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_AUTH = 'auth/GET_AUTH';
export const UPDATE_AUTH = 'auth/UPDATE_AUTH';
export const INIT_AUTH = 'auth/INIT_AUTH';
export const SET_AUTH = 'auth/SET_AUTH';

const actions = createActions({
    [GET_AUTH]: () => {},
    [UPDATE_AUTH]: () => {},
    [INIT_AUTH]: () => {},
    [SET_AUTH]: () => {},
});

/* 리듀서 */
const authReducer = handleActions(
    {
        [GET_AUTH]: (state, { payload }) => {
            return payload;
        },
        [UPDATE_AUTH]: (state, { payload }) => { // 권한 등록/수정 모달에서 노출 순서 싱크를 맞춰줌

            let newState;
            
            payload.map((element) => {
                
                if(element.authorityCode === state.authorityCode) { // 권한 수정
                    newState = element;
                }

                if(element.authorityCode.toString().includes('-')) { // 권한 생성
                    newState = element;
                }
            })

            return newState;
        },
        [INIT_AUTH]: (state, { payload }) => {
            return {
                authorityCode: '',
                authorityName: '',
                authorityDescription: '',
                authorityExposureOrder: '',
                authorityActivatedYn: 'N'
            };
        },
        [SET_AUTH]: (state, { payload }) => {
            
            return payload;
        }
    },
    initialState
);

export default authReducer;
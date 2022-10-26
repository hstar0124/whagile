import { createActions, handleActions } from 'redux-actions';
import uuid from "uuid/v4";

/* 초기값 */
const initialState = [];

/* 액션 */
export const GET_AUTH_ORDER = 'authOrder/GET_AUTH_ORDER';         // API에서 받아온 order 입력
export const UPDATE_AUTH_ORDER = 'authOrder/UPDATE_AUTH_ORDER';   // 순서 변경 시 authOrder에 적용
export const INSERT_AUTH_ORDER = 'authOrder/INSERT_AUTH_ORDER';   // 권한 등록 시 order 추가
export const DELETE_AUTH_ORDER = 'authOrder/DELETE_AUTH_ORDER';   // 권한 등록 시 추가된 order 제거
export const SET_AUTH_ORDER = 'authOrder/SET_AUTH_ORDER';         // 변경된 order로 입력
export const SET_AUTH_ORDER_UPDATE = 'authOrder/SET_AUTH_ORDER_UPDATE'; // 변경된 order로 입력

const actions = createActions({
    [GET_AUTH_ORDER]: () => {},
    [UPDATE_AUTH_ORDER]: () => {},
    [INSERT_AUTH_ORDER]: () => {},
    [DELETE_AUTH_ORDER]: () => {},
    [SET_AUTH_ORDER]: () => {},
    [SET_AUTH_ORDER_UPDATE]: () => {},
});

/* 리듀서 */
const authOrderReducer = handleActions(
    {
        [GET_AUTH_ORDER]: (state, { payload }) => {
            return payload;
        },
        [UPDATE_AUTH_ORDER]: (state, { payload }) => {
            
            let newState = [...payload];

            for(let i = 0; i < newState.length; i++) {

                newState[i] = {
                    ...newState[i],
                    authorityExposureOrder: i + 1
                }
            }

            return newState;
        },
        [INSERT_AUTH_ORDER]: (state, { payload }) => {
            
            let newState = [...state];
            
            newState.push({
                authorityCode: payload.authorityCode? payload.authorityCode: uuid(),
                authorityName: payload.authorityName,
                authorityDescription: payload.authorityDescription,
                authorityActivatedYn: 'Y',
                authorityExposureOrder: newState.length + 1,
            });

            return newState;
        },
        [DELETE_AUTH_ORDER]: (state, { payload }) => { // 비활성화 시 authOrder에서 해당 auth를 제거
            
            let newState = [...state];
            
            for(let i = 0; i < newState.length; i++) {
                if(newState[i].authorityCode.toString().includes('-')) {
                    newState.splice(i, 1);
                }
            }

            return newState;
        },
        [SET_AUTH_ORDER]: (state, { payload }) => { 
            return payload;
        },
        [SET_AUTH_ORDER_UPDATE]: (state, { payload }) => { // authOrder에서 auth의 변경사항을 적용
            
            let newState = [...state];

            for(let i = 0; i < newState.length; i++) {
                if(newState[i].authorityCode === payload.authorityCode) {
                    newState[i] = payload;
                }
            }
            
            if(payload.authorityActivatedYn === 'N') {
                newState = newState.filter((auth) => auth.authorityCode !== payload.authorityCode);
                for(let i = 0; i < newState.length; i++) {
                    newState[i].authorityExposureOrder = i + 1;
                }
            }
            
            return newState;
        }
    },
    initialState
);

export default authOrderReducer;
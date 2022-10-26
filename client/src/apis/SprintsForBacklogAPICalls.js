import { FIND_SPRINTS, CLEAN_SPRINTS } from '../modules/SprintsForBacklogModule';
import { REGIST_SPRINT, MODIFY_SPRINT, CHANGE_SPRINT_PROGRESS_STATUS, REMOVE_SPRINT } from '../modules/SprintForBacklogModule';

/* 스프린트 목록 조회 API 호출 */
export function callGetSprintsAPI(params) {

    let requestURL = `http://${ process.env.REACT_APP_RESTAPI_IP }:8888/api/sprints`;

    if(Object.keys(params).length !== 0) {

        console.log(params)
        const paramKeys = [];
        const paramValues = [];

        Object.keys(params).forEach(param => paramKeys.push(param));
        Object.values(params).forEach(param => paramValues.push(param));

        requestURL = requestURL + '?';

        for(let i = 0; i < Object.keys(params).length; i++) {
            requestURL += `${ paramKeys[i] }=${ paramValues[i] }&`;
        }
        
        console.log('스프린트 목록 조회 요청 API: ', requestURL);
        requestURL = requestURL.slice(0, requestURL.length - 1);
        console.log('스프린트 목록 조회 요청 API: ', requestURL);
    }

    return async function findSprints(dispatch, getState) {
        // const preState = await getState().sprintsForBacklogReducer;

        const result = await fetch(requestURL).then(res => res.json());

        await dispatch({ type: FIND_SPRINTS, payload: result.results });
        console.log('스프린트', result);
        // await dispatch({ type: FIND_SPRINTS, payload: preState.concat(result.results) });
    }
}

/* 스프린트 생성 API 호출 */
export function callPostSprintAPI(newSprint) {

    const requestURL = `http://${ process.env.REACT_APP_RESTAPI_IP }:8888/api/sprints`;

    return async function registSprint(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(newSprint)
        }).then(res => res.json());

        await dispatch({ type: REGIST_SPRINT, payload: result });
        console.log('스프린트 등록결과 ', result)       
    }
}

/* 스프린트 수정 API 호출 */
export function callPutSprintAPI(params) {

    const requestURL = `http://${ process.env.REACT_APP_RESTAPI_IP }:8888/api/sprints`;
    
    return async function modifySprint(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(params)
        }).then(res => res.json());
        
        await dispatch({ type: MODIFY_SPRINT, payload: result });
        console.log('스프린트 시작 결과 ', result)
    }
}

/* 스프린트 시작 및 종료 API 호출 */
export function callChangeSprintStatusAPI(params) {

    const requestURL = `http://${ process.env.REACT_APP_RESTAPI_IP }:8888/api/sprints/progress`;
    
    return async function changeSprintProgressStatus(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(params)
        }).then(res => res.json());
        
        await dispatch({ type: CHANGE_SPRINT_PROGRESS_STATUS, payload: result });
        console.log('스프린트 시작 결과 ', result)
    }
}

/* 스프린트 삭제 API 호출 */
export function callDeleteSprintAPI(params) {
    
    const requestURL = `http://${ process.env.REACT_APP_RESTAPI_IP }:8888/api/sprints`;
    
    return async function removeSprint(dispatch, getState) {
        const result = await fetch(requestURL, {
            method: 'DELETE', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(params)
        }).then(res => res.json());
        await dispatch({ type: REMOVE_SPRINT, payload: result});
    }
};

/* 기존 스프린트 목록 초기화 */
export function callCleanSprints() {

    return async function cleanSprints(dispatch, getState) {

        dispatch({ type: CLEAN_SPRINTS, payload: [] });
    }
}
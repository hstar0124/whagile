import { FIND_BACKLOGS, MORE_BACKLOGS, FIND_FILTERED_BACKLOGS, CLEAN_BACKLOG } from '../modules/BacklogModule';
import { FIND_BACKLOG_DETAILS, REGIST_BACKLOG, MODIFY_BACKLOG, DELETE_BACKLOG } from '../modules/BacklogDetailModule';

/* 백로그 목록 조회 (최초 요청) API 호출 */
export function callGetBacklogsAPI(params) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs`;

    if(Object.keys(params).length !== 0) {

        const paramKeys = [];
        const paramValues = [];

        Object.keys(params).forEach(param => paramKeys.push(param));
        Object.values(params).forEach(param => paramValues.push(param));

        console.log(`param keys and values\n${paramKeys}\n${paramValues}`)

        requestURL = requestURL += '?';

        for(let i = 0; i < Object.keys(params).length; i++) {
            requestURL += `${paramKeys[i]}=${paramValues[i]}&`;
        }

        requestURL = requestURL.slice(0, requestURL.length - 1);

        console.log(`requestURL 어떻게 생겼니? ${ requestURL }`)
    }

    return async function findBacklogs(dispatch, getState) {

        const preState = getState().backlogReducer;
        
        const result = await fetch(requestURL).then(res => res.json());

        if(preState.length > 0) {
            await dispatch({ type: MORE_BACKLOGS,  payload: result.results });
        } else {
            await dispatch({ type: FIND_BACKLOGS,  payload: result.results });
        }
    };
}

/* 백로그 목록 조회 (필터링) API 호출 */
export function callGetFilteredBacklogsAPI(params) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs`;

    if(Object.keys(params).length !== 0) {

        const paramKeys = [];
        const paramValues = [];

        Object.keys(params).forEach(param => paramKeys.push(param));
        Object.values(params).forEach(param => paramValues.push(param));

        console.log(`param keys and values\n${paramKeys}\n${paramValues}`)

        requestURL = requestURL += '?';

        for(let i = 0; i < Object.keys(params).length; i++) {
            requestURL += `${paramKeys[i]}=${paramValues[i]}&`;
        }

        requestURL = requestURL.slice(0, requestURL.length - 1);

        console.log(`requestURL 어떻게 생겼니::: ${ requestURL }`)
    }

    return async function findFilteredBacklogs(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());
        const preState = getState().backlogReducer;

        if(preState.length > 0) {
            await console.log('확인해보기2: ', result.results)
            await dispatch({ type: MORE_BACKLOGS,  payload: result.results });
        } else {
            await console.log('확인해보기1: ', result.results)
            await dispatch({ type: FIND_FILTERED_BACKLOGS,  payload: result.results });
        }
    };
}

/* 백로그 상세 조회 API 호출 */
export function callGetBacklogDetailsAPI(backlogCode) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs/` + backlogCode;
    console.log('requestURL: ' + requestURL);

    return async function findBacklogDetails(dispatch, getState) {

        const result = await fetch(requestURL).then(res => res.json());

        dispatch({ type: FIND_BACKLOG_DETAILS, payload: result.results});
    }
}

/* 백로그 생성 API 호출 */
export function callPostBacklogAPI(newBacklog) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs`;

    return async function registBacklogComment(dispatch, getState) {

        const result = await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(newBacklog)
        }).then(res => res.json());

        await dispatch({ type: REGIST_BACKLOG, payload: result.message });
    }
}

/* 백로그 수정 API 호출 */
export function callPutBacklogAPI(modifiedBacklog) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs`;

    return async function modifyBacklog(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify(modifiedBacklog)
        }).then(res => res.json());

        dispatch({ type: MODIFY_BACKLOG, payload: result.message });
        console.log('얍!!!! ', result)
        // await dispatch({ type: FIND_BACKLOG_DETAILS, payload: result.results });
    }
}

/* 백로그 삭제 API 호출 */
export function callDeleteBacklogAPI(backlogCode, projectCode) {

    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs`;

    return async function removeBacklog(dispatch, getState) {
        
        const result = await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Token': window.localStorage.getItem('access_token')
            },
            body: JSON.stringify({
                'backlogCode': backlogCode, 
                'projectCode': projectCode
            })
        }).then(res => res.json());

        await dispatch({ type: DELETE_BACKLOG, payload: result.message });
        // await dispatch({ type: FIND_BACKLOG_DETAILS, payload: result.results });
    }
}

/* 기존 state reset */
export function callCleanBacklog() {

    return async function cleanBacklogComments(dispatch, getState) {
        await dispatch({ type: CLEAN_BACKLOG, payload: [] });
    }
};
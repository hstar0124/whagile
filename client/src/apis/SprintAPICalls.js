import { GET_SPRINTS } from '../modules/SprintsModule';
import { GET_SPRINT } from '../modules/SprintModule';
import { GET_BACKLOGS } from '../modules/SprintBacklogsModule';
import { GET_COUNT } from '../modules/SprintsCountModule';
import { GET_SPRINT_TASK } from '../modules/SprintTaskModule';

export function callGetSprintsAPI(params, prevSprints) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints`;
    
    let defaultParams = { 
        offset: 0,
        limit: 10,
        orderCondition: 'code',
        orderValue: 'desc',
    };

    if(params === undefined || Object.keys(params).length === 0) {
        requestURL += `?${Object.entries(defaultParams).map(param => param.join('=')).join('&')}`;
    } else {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        await dispatch({ 
            type: GET_SPRINTS, 
            payload: {
                result: result.results,
                prevSprints: prevSprints,
            }
        });

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: params.projectCode,
            searchCondition: params.searchCondition,
            searchValue: params.searchValue
        }));

    }
}

export function callGetSprintAPI(params) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints/${params.sprintCode}`;
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        dispatch({ type: GET_SPRINT, payload: result.results });
    }
}

export function callPostSprintAPI(params, changedTasks, currentInfo) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints`;
    
    return async (dispatch, getState) => {
        
        await fetch(requestURL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sprintName: params.sprintName,
                sprintTarget: params.sprintTarget,
                sprintStartDate: (params.sprintStartDate)? dateFormat(new Date(params.sprintStartDate), 'start'): null,
                sprintEndDate: (params.sprintEndDate)? dateFormat(new Date(params.sprintEndDate), 'end'): null,
                sprintProgressStatus: 'N',
                changedTasks: changedTasks,
                currentInfo: currentInfo,
            })
        }).then(res => res.json());
        
        await dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
            projectCode: parseInt(currentInfo.projectCode),
            isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
            offset: currentInfo.offset,
            limit: currentInfo.limit
        }, currentInfo.prevSprints));

        await dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
            offset: 0,
            limit: 1000,
            projectCode: currentInfo.projectCode
        }));

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: currentInfo.projectCode
        }));
    }
}

export function callPutSprintAPI(params, changedTasks, currentInfo) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints`;
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sprintCode: params.sprintCode,
                sprintName: params.sprintName,
                sprintTarget: params.sprintTarget,
                sprintStartDate: (params.sprintStartDate)? dateFormat(new Date(params.sprintStartDate), 'start'): null,
                sprintEndDate: (params.sprintEndDate)? dateFormat(new Date(params.sprintEndDate), 'end'): null,
                sprintProgressStatus: params.sprintProgressStatus,
                changedTasks: changedTasks,
                currentInfo: currentInfo,
            })
        }).then(res => res.json());
        
        await dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
            projectCode: parseInt(currentInfo.projectCode),
            isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
            offset: currentInfo.offset,
            limit: currentInfo.limit
        }, currentInfo.prevSprints));

        await dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
            offset: 0,
            limit: 1000,
            projectCode: currentInfo.projectCode
        }));

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: currentInfo.projectCode
        }));
    }
}

export function callDeleteSprintAPI(sprintCode, currentInfo) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints`;
    
    return async (dispatch, getState) => {
        
        await fetch(requestURL, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sprintCode: sprintCode,
                currentInfo: currentInfo
            })
        })
        
        await dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
            projectCode: parseInt(currentInfo.projectCode),
            isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
            offset: currentInfo.offset,
            limit: currentInfo.limit
        }, currentInfo.prevSprints));

        await dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
            offset: 0,
            limit: 1000,
            projectCode: currentInfo.projectCode
        }));

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: currentInfo.projectCode
        }));
    }
}

export function callGetBacklogsAPI(params) {

    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/backlogs`;

    if(!(params === undefined || Object.keys(params).length === 0)) {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        dispatch({ type: GET_BACKLOGS, payload: result.results });
    }
}

export function callGetSprintsCountAPI(params) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints/count`;

    if(!(params === undefined || Object.keys(params).length === 0)) {
        requestURL += `?${Object.entries(params).map(param => param.join('=')).join('&')}`;
    }
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        dispatch({ type: GET_COUNT, payload: result.results });
    }
}

export function callGetTaskAPI(params) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks/${params.taskCode}`;
    
    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL).then(res => res.json());
        
        dispatch({ type: GET_SPRINT_TASK, payload: result.results[0] });
    }
}

export function callUpdateTaskAPI(params, currentInfo) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks`;

    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                kanbanInfo: {
                    backlogTitle: params.backlogTitle,
                    backlogDescription: (params.backlogDescription)? params.backlogDescription: '',
                    progressStatus: (params.backlogProgressStatus)? params.backlogProgressStatus: '',
                    urgency: (params.backlogUrgency)? params.backlogUrgency: '',
                    backlogCategory: (params.backlogCategory)? params.backlogCategory: '',
                    backlogChargerCode: (params.backlogChargerCode)? params.backlogChargerCode: null,
                    issue: (params.backlogIssue)? params.backlogIssue: 0,
                    backlogCode: (params.backlogCode)? params.backlogCode: '',
                    backlogStartDate: (params.backlogStartDate)? dateFormat(new Date(params.backlogStartDate), 'start'): '',
                    backlogEndDate: (params.backlogEndDate)? dateFormat(new Date(params.backlogEndDate), 'end'): '',
                    sprintCode: params.sprintCode,
                    projectCode: currentInfo.projectCode,
                    memberCode: currentInfo.memberCode
                }
            })
        }).then(res => res.json());
        
        await dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
            projectCode: currentInfo.projectCode,
            isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
            offset: currentInfo.offset,
            limit: currentInfo.limit
        }, currentInfo.prevSprints));

        await dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
            offset: 0,
            limit: 1000,
            projectCode: currentInfo.projectCode
        }));

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: currentInfo.projectCode
        }));
    }
}

export function callUpdateTaskForGanttAPI(params, currentInfo) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks/date`;

    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                taskCode: params.id.substr(1),
                taskStartDate: (params.start)? dateFormat(new Date(params.start), 'start'): null,
                taskEndDate: (params.end)? dateFormat(new Date(params.end), 'end'): null,
            })
        }).then(res => res.json());
        
        await dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
            projectCode: currentInfo.projectCode,
            isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
            offset: currentInfo.offset,
            limit: currentInfo.limit
        }, currentInfo.prevSprints));

        await dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
            offset: 0,
            limit: 1000,
            projectCode: currentInfo.projectCode
        }));

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: currentInfo.projectCode
        }));
    }
}

export function callUpdateSprintProgressAPI(params, currentInfo) {
    
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/sprints/progress`;

    return async (dispatch, getState) => {
        
        const result = await fetch(requestURL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...params,
                currentInfo: currentInfo
            })
        }).then(res => res.json());
        
        await dispatch(callGetSprintsAPI({	// 스프린트 목록 조회
            projectCode: currentInfo.projectCode,
            isGantt: true,	// true일 경우, 진행 중 sprint가 맨위에 오고 진행 중이 아닌 sprint들은 sprintCode로 내림차순 정렬된다
            offset: currentInfo.offset,
            limit: currentInfo.limit
        }, currentInfo.prevSprints));

        await dispatch(callGetBacklogsAPI({	// 스프린트 내 백로그 목록 조회
            offset: 0,
            limit: 1000,
            projectCode: currentInfo.projectCode
        }));

        await dispatch(callGetSprintsCountAPI({ // 스프린트, 일감, 백로그 갯수 조회
            projectCode: currentInfo.projectCode
        }));
    }
}

function dateFormat(date, when) { // Fri Jul 01 2022 00:00:00 GMT+0900 (한국 표준시) 형식을 '2022-07-01 00:00:00'으로 바꿔줌
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    month = month >= 10 ? month : '0' + month;
    day = day >= 10 ? day : '0' + day;
    hour = hour >= 10 ? hour : '0' + hour;
    minute = minute >= 10 ? minute : '0' + minute;
    second = second >= 10 ? second : '0' + second;

    if(when === 'start') {
        return date.getFullYear() + '-' + month + '-' + day  + ' 00:00:00';
    }

    if(when === 'end') {
        return date.getFullYear() + '-' + month + '-' + day  + ' 23:59:59';
    }
}
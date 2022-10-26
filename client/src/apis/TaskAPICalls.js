import { GET_TASKS } from "../modules/TasksModule";
import { GET_TASK } from "../modules/TaskModule";
import { PUT_TASK } from "../modules/TaskModule";
import { POST_TASK } from "../modules/TaskModule";
import { DELETE_TASK } from "../modules/TaskModule";
import { GET_SPRINT } from "../modules/TasksSprintModule";


//전체 일감 목록 조회 API
export function callGetTasksAPI(projectCode) {

  const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks?projectCode=${projectCode}&backlogCategory=백로그`;
  const requestURL2 = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks/onTask?projectCode=${projectCode};`;

  return async function getTasks(dispatch, getState) {
    const backlogs = await fetch(requestURL).then((res) => res.json());
    const tasks = await fetch(requestURL2).then((res) => res.json());

    // console.log('backlogs', backlogs)
    // console.log('tasks', tasks)
    // console.log('backlogs&tasks', backlogs.results.concat(tasks.results))

    dispatch({ type: GET_TASKS, payload: backlogs.results.concat(tasks.results) });
  };
}


// 개별 일감 조회 API
export const callGetTaskAPI = (taskCode) => {
  // console.log(taskCode);
  let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks/${taskCode}`;
  // console.log("requestURL:", requestURL);
  return async (dispatch, getState) => {
    const result = await fetch(requestURL).then((res) => res.json());

    dispatch({ type: GET_TASK, payload: result.results });
  };
};


// 개별 일감 수정 API
export const callPutTaskAPI = (
  taskCode,
  backlogTitle,
  backlogDescription,
  progressStatus,
  urgency,
  memberName,
  issue,
  backlogChargerCode,
  projectCode,
) => {
  let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks/${taskCode}`;

  return async (dispatch, getState) => {
    const result = await fetch(requestURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        taskCode: Number(taskCode),
        backlogTitle: backlogTitle,
        backlogDescription: backlogDescription,
        progressStatus: progressStatus,
        urgency: urgency,
        memberName: memberName,
        issue: issue,
        backlogChargerCode: Number(backlogChargerCode),
        projectCode: Number(projectCode)
      }),
    }).then((res) => res.json());

    await dispatch({ type: PUT_TASK, payload: result.results });
    await dispatch(callGetTasksAPI());
  };
};






// 개별 일감 생성 API
export const callPostTaskAPI = (paramTask) => {
  let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks`;
  
  return async (dispatch, getState) => {
    const result = await fetch(requestURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Accept': "application/json",
      },
      body: JSON.stringify({
        taskCode: paramTask.taskCode,
        backlogTitle: paramTask.backlogTitle,
        backlogDescription: paramTask.backlogDescription,
        progressStatus: paramTask.progressStatus,
        urgency: paramTask.urgency,
        memberName: paramTask.memberName,
        issue: paramTask.issue,
        backlogChargerCode: paramTask.backlogChargerCode
      }),
    }).then((res) => res.json());
    await dispatch({ type: POST_TASK, payload: result.results });

  };
};


// 개별 일감 삭제
export function callDeleteTaskAPI(taskCode, projectCode, category) {
  const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks`;

  return async function removeTask(dispatch, getState) {
    const result = await fetch(requestURL, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Access-Token": window.localStorage.getItem("access_token"),
      },
      body: JSON.stringify({
        'taskCode':taskCode,
        'projectCdoe':projectCode,
        'category': category
      }),
    }).then((res) => res.json());

    await dispatch({ type: DELETE_TASK, payload: result.results });
  };
}

export function callGetTasksSprintAPI(projectCode) {

  const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/tasks/sprint?projectCode=${projectCode}`;

  return async function getTasks(dispatch, getState) {

    const result = await fetch(requestURL).then((res) => res.json());
    if (result.results.length !== 0){
      dispatch({ type: GET_SPRINT, payload: result.results[0] });
    } else {
      dispatch({ type: GET_SPRINT, payload: {} });
    }
  };
}
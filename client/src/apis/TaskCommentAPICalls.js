
import { POST_TASK_COMMENT, PUT_TASK_COMMENT, DELETE_TASK_COMMENT } from "../modules/TaskCommentModule";
import { GET_TASK_COMMENTS } from "../modules/TaskTotalCommentModule";


// 전체 조회
export default function callGetTaskAllCommentsAPI(backlogCode) {
    let requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/task-comment/${backlogCode}`;

    return async function findTaskAllComments(dispatch, getState) {
      const result = await fetch(requestURL).then((res) => res.json());

      await dispatch({ type: GET_TASK_COMMENTS, payload: result.results });
    } 

}



// 등록
export function callPostTaskCommentAPI(TaskNewComment) {
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/task-comment`;

    return async function createTaskComment(dispatch, getState) {
      const result = await fetch(requestURL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Token": window.localStorage.getItem("access_token"),
        },
        body: JSON.stringify(TaskNewComment),
      }).then((res) => res.json());

      await dispatch({ type: POST_TASK_COMMENT, payload: result });
    };
}



// 수정
export function callPutTaskCommentAPI(editRequest) {
    const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/task-comment`;

    return async function updateTaskComment(dispatch, getState) {
      const result = await fetch(requestURL, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Access-Token": window.localStorage.getItem("access_token"),
        },
        body: JSON.stringify(editRequest),
      }).then((res) => res.json());

      await dispatch({ type: PUT_TASK_COMMENT, payload: result });
    };
}

// 삭제
export function callDeleteTaskCommentAPI(deleteTaskComment) {
  const requestURL = `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/task-comment`;

  return async function removeTaskComment(dispatch, getState) {
    const result = await fetch(requestURL, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Token": window.localStorage.getItem("access_token"),
      },
      body: JSON.stringify(deleteTaskComment),
    }).then((res) => res.json());

    await dispatch({ type: DELETE_TASK_COMMENT, payload: result });
  };
}

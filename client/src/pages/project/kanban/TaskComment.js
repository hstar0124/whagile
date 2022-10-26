import { decodeJwt } from "../../../utils/tokenUtils"

import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from "primereact/button";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import taskCommentStyle from "./TaskComment.module.css";
import TaskEditComment from "./TaskEditComment";

import {
  callPostTaskCommentAPI,
} from "../../../apis/TaskCommentAPICalls";

export default function TaskComment({
  taskCode,
  taskProjectCode,
  taskCategory,
}) {

  const user = decodeJwt(window.localStorage.getItem("access_token"));
  const dispatch = useDispatch();
  const toast = useRef(null);

  const taskComments = useSelector((state) => state.taskTotalCommentReducer);
  const taskComment = useSelector((state) => state.taskCommentReducer);

  const [taskCommentContent, setTaskCommentContent] = useState(null);


  // 등록
  const registTaskNewComment = () => {
    const newTaskComment = {
      taskCommentContent: taskCommentContent,
      taskCode: taskCode,
      taskProjectCode: parseInt(taskProjectCode),
    };

    return new Promise(async (resolve, reject) => {
      await dispatch(callPostTaskCommentAPI(newTaskComment));
      await window.location.replace(window.location.href);
    });
  };


  const noComment = useMemo(() => {
    return {
      show: { display: taskComments.length > 0 ? "none" : "block" },
      hide: { display: taskComments.length > 0 ? "block" : "none" },
    };
  }, [taskComments]);



  useEffect(() => {
    if (taskComment.status === 200 || taskComment.status === 201) {
      toast.current.show({
        severity: "info",
        summary: "Confirmed",
        detail: taskComment.message,
        life: 3000,
      });
    }
  }, []);

  return (
    <>
      <>
        <div
          style={noComment.show}
        >{`해당 [ ${taskCategory} ] 의 댓글이 없습니다.`}</div>
        {taskComments.map((taskComment) => (
          <div key={taskComment.taskCommentCode}>
            <TaskEditComment
              taskComment={taskComment}
            />
          </div>
        ))}
        <div style={noComment.hide}></div>
        <div id={taskCommentStyle.taskCommentInput}>
          <InputTextarea
            value={taskCommentContent || ""}
            onChange={(e) => setTaskCommentContent(e.target.value)}
            placeholder="댓글을 입력해 주세요."
            rows={5}
            cols={100}
          />
        </div>
        <br />
        <Button
          label="등록"
          onClick={registTaskNewComment}
          disabled={
            taskCommentContent === null || taskCommentContent === ""
              ? true
              : false
          }
        />
      </>
    </>
  );
}

import { decodeJwt } from "../../../utils/tokenUtils";

import { useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

import { useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  callPutTaskCommentAPI,
  callDeleteTaskCommentAPI,
} from "../../../apis/TaskCommentAPICalls";


import taskCommentStyle from "./TaskComment.module.css";




export default function TaskEditComment({
  taskComment,
}) {
  const { projectCode } = useParams();
  const [editComment, setEditComment] = useState("");

  useEffect(() => {
    setEditComment(taskComment.taskCommentContent);
    // console.log("taskComment", taskComment);
  }, [taskComment]);



  const user = decodeJwt(window.localStorage.getItem("access_token"));
  const dispatch = useDispatch();
  const toast = useRef(null);

  const [commentEditable, setCommentEditable] = useState(false);
  const [modifiedTaskComment, setModifiedTaskComment] = useState(null);

  const updateTaskCommentRequest = {
    taskCommentCode: 0,
    projectCode: Number(projectCode),
    modifiedTaskComment: modifiedTaskComment,
  };
  const [removeTaskCommentRequest, setRemoveTaskCommentRequest] = useState({});
  const [deleteVisible, setDeleteVisible] = useState(false);


  // 수정
  const editTaskComment = () => {
    setCommentEditable(true);
  };

  const confirmModification = (taskCommentCode) => {
    updateTaskCommentRequest.taskCommentCode = taskCommentCode;
    updateTaskCommentRequest.taskCommentContent = editComment;
    
    dispatch(callPutTaskCommentAPI(updateTaskCommentRequest));
    setCommentEditable(false);
    window.location.replace(window.location.href);
  };

  // 삭제
  const removeTaskComment = (taskCommentCode) => {
    setRemoveTaskCommentRequest({
      taskCommentCode: taskCommentCode,
      projectCode: projectCode,
    });

    setDeleteVisible(true);
  };

  const accept = (taskCommentCode, memberCode) => {
    return new Promise(async (resolve, reject) => {
      await dispatch(callDeleteTaskCommentAPI(removeTaskCommentRequest));
      await setDeleteVisible(false);
      await window.location.replace(window.location.href);
    });
  };

  const reject = () => {};

  const toggleCheck = useMemo(() => {
    return {
      on: { display: !commentEditable ? "none" : "block" },
      off: { display: commentEditable ? "none" : "block" },
    };
  }, [commentEditable]);



  return (
    <>
      <div>
        <label id={taskCommentStyle.taskCommentContents}>
          <div id={taskCommentStyle.taskCommentMemberName}>
            [ {taskComment.memberName} ]
          </div>
          <div id={taskCommentStyle.taskCommentDate}>
            {taskComment.modifiedYN === "Y"
              ? taskComment.taskCommentModifiedDate
              : "작성일 - " + taskComment.taskCommentCreatedDate}{" "}
            {taskComment.taskCommentModifiedYN === "Y"
              ? `( 수정일 - ${taskComment.taskCommentModifiedDate} )`
              : ""}
          </div>
          <div id={taskCommentStyle.taskCommentContent}>
            <input
              id={taskCommentStyle.taskCommentContentInput}
              name={taskComment.taskCommentCode}
              type="text"
              value={editComment || ""}
              placeholder={taskComment.taskCommentContent}
              readOnly={!commentEditable ? true : false}
              onChange={(e) => setEditComment(e.target.value)}
            ></input>
          </div>
        </label>
        <div id={taskCommentStyle.taskCommentTotalBtn}>
          <div style={toggleCheck.on}>
            <Button
              id={taskCommentStyle.taskCommentSaveBtn}
              label="저장"
              onClick={() => confirmModification(taskComment.taskCommentCode)}
            />
            <Button
              id={taskCommentStyle.taskCommentCancelBtn}
              label="취소"
              onClick={() => setCommentEditable(false)}
            />
          </div>
          <div
            style={{
              visibility:
                taskComment.memberCode === user.code && !commentEditable
                  ? "visible"
                  : "hidden",
            }}
          >
            <button
              id={taskCommentStyle.taskCommentEditBtn}
              name="editTaskComment"
              onClick={() => editTaskComment(taskComment.taskCommentCode)}
            >
              수정
            </button>
            <button
              id={taskCommentStyle.taskCommentDeleteBtn}
              onClick={() =>
                removeTaskComment(
                  taskComment.taskCommentCode,
                  taskComment.memberCode,
                  taskComment.projectCode
                )
              }
            >
              삭제
            </button>
          </div>
        </div>
      </div>
      <Toast ref={toast} />
      <ConfirmDialog
        visible={deleteVisible}
        onHide={() => setDeleteVisible(false)}
        message="댓글을 삭제하면 복구할 수 없습니다."
        header="댓글을 삭제하시겠습니까?"
        icon="pi pi-exclamation-triangle"
        rejectLabel="NO"
        acceptLabel="YES"
        accept={() => accept()}
        reject={() => reject()}
      />
    </>
  );
}


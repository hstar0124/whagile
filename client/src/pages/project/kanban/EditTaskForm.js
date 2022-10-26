
import React, { useState, useEffect } from "react";
import { Category, Urgency } from "./Types";
import KanbanBoardStyle from "./KanbanBoard.module.css";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";


// 일감 생성 모달 창
export default function EditTaskForm({onChangeTask, taskAll, onFormSubmit, onClose, category}) {
  const sprint = useSelector((state) => state.tasksSprintReducer);
  const { projectCode } = useParams();

  const [taskMemberList, setTaskMemberList] = useState([]);

  useEffect(() => {

    fetch(
      `http://${process.env.REACT_APP_RESTAPI_IP}:8888/api/projects/${projectCode}/member`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((json) => setTaskMemberList(json.results));
    },[projectCode]
    );
    

	return (
    <div className={KanbanBoardStyle.kanbanModalContent}>
      <form onSubmit={onFormSubmit || ""}>
        <div className={KanbanBoardStyle.kanbanTitles}>
          {category}&nbsp; 만들기
        </div>
        <div>
          <label
            htmlFor="input-title"
            className={KanbanBoardStyle.kanbanDetailTitle}
          >
            요약 *
          </label>
          <textarea
            name="taskTitle"
            className={KanbanBoardStyle.kanbanDetailInputTitle}
            id="input-title"
            placeholder="필수 입력 사항입니다."
            value={taskAll.taskTitle || ""}
            onChange={(event) => onChangeTask(event)}
            required
          ></textarea>
        </div>
        <div>
          <label
            htmlFor="input-textarea"
            className={KanbanBoardStyle.kanbanDetailDescription}
          >
            설명
          </label>
          <textarea
            name="taskDescription"
            className={KanbanBoardStyle.kanbanDetailInputDescription}
            id="input-description"
            value={taskAll.taskDescription || ""}
            onChange={(event) => onChangeTask(event)}
          ></textarea>
        </div>
        <div className={KanbanBoardStyle.TaskOptions}>
          <select
            name="taskProgressStatus"
            className={KanbanBoardStyle.kanbanDetailInputSelection}
            id="select-category"
            value={taskAll.taskProgressStatus || ""}
            onChange={(event) => onChangeTask(event)}
          >
            {Object.keys(sprint).length > 0 ? (
              <>
                <option value={Category.Backlog}>백로그</option>
                <option value={Category.Before}>진행 전</option>
                <option value={Category.InProgress}>진행 중</option>
                <option value={Category.Done}>완료</option>
              </>
            ) : (
              <>
                <option value={Category.Backlog}>백로그</option>
              </>
            )}
          </select>
          <select
            name="taskIssue"
            className={KanbanBoardStyle.kanbanDetailInputSelection}
            id="select-issue"
            value={taskAll.taskIssue || ""}
            onChange={(event) => onChangeTask(event)}
          >
            <option value={0}>기본</option>
            <option value={1}>이슈</option>
          </select>

          <select
            name="taskUrgency"
            className={KanbanBoardStyle.kanbanDetailInputSelection}
            id="select-urgency"
            value={taskAll.taskUrgency || ""}
            onChange={(event) => onChangeTask(event)}
          >
            <option value={Urgency.LowGrade}>낮음</option>
            <option value={Urgency.NormalGrade}>보통</option>
            <option value={Urgency.HighGrade}>긴급</option>
          </select>

          <select
            name="taskCharger"
            className={KanbanBoardStyle.kanbanDetailInputSelection}
            id="select-charger"
            value={taskAll.taskCharger || ""}
            onChange={(event) => onChangeTask(event)}
          >
            <option value={null} name="담당자없음">
              담당자 없음
            </option>
            {taskMemberList.map((member) => (
              <option key={member.memberCode} value={member.memberCode}>
                {member.memberName}
              </option>
            ))}
          </select>
        </div>

        <div className={KanbanBoardStyle.kanbanDetailButton}>
          <div>
            <input
              className={KanbanBoardStyle.saveButton}
              type="Submit"
              value="확인"
              readOnly={true}
            />
            <button
              className={KanbanBoardStyle.cancelButton}
              type="button"
              onClick={onClose}
            >
              취소
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

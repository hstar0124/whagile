import TaskModal from "./TaskModal";
import React, { useState } from "react";
import KanbanBoardStyle from "./KanbanBoard.module.css";
import TaskCreateModal from "./TaskCreateModal";

 // 일감 생성 버튼
function NewTaskButton(props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div>
        <button
          className={KanbanBoardStyle.kanbanBoxAddButton}
          onClick={(e) => {
            setShowModal(true);
          }}
        >
          +
        </button>
      </div>
      {showModal && (
        <TaskCreateModal
          category={props.category}
          type="Create"
          onSubmit={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}



// 일감 상세 조회 및 수정버튼
function EditButton(props) {

  return (
    <div
      role="button"
      className={KanbanBoardStyle.kanbanEditAndDetailButton}
      onClick={props.onClick}
    >
      ≡
    </div>
  );
}



// 칸반 개별 일감들(박스)
function KanbanBox(props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <div
        className={KanbanBoardStyle.kanbanBox}
        draggable={true}
      >
        {props.data.backlogTitle}
        <EditButton
          onClick={(event) => {
            event.stopPropagation();
            setShowModal(true);
          }}
        ></EditButton>
      </div>
      {showModal && (
        <TaskModal
          type="Edit"
          onSubmit={() => {
            setShowModal(false);
          }}
          currentTaskID={props.data.backlogCode}
        />
      )}
    </>
  );
}


// 칸반 컬럼
export function KanbanColumn(props) {
  return (
    <>
      <div className={KanbanBoardStyle.columnTitle}>
        <h2 className={KanbanBoardStyle.kanbanColumnTitle}>{props.category}</h2>
      </div>
      <div className={KanbanBoardStyle.kanbanNewTaskButtonDiv}>
        <NewTaskButton category={props.category} />
      </div>
      <div className={KanbanBoardStyle.kanbanColumn}>
        <div>
          {props.data &&
            props.data.map((task) => (
              <KanbanBox key={task.backlogCode} data={task} />
            ))}
        </div>
      </div>
    </>
  );
}

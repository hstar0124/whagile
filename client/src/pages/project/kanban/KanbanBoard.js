
import TaskTotalScreen from "./TaskTotalScreen";


import React from "react";

import KanbanBoardStyle from "./KanbanBoard.module.css";
import PageTitle from "../../../components/items/PageTitle";




// 칸반 보드
export default function KanbanBoard() {


  return (
    <>
      <PageTitle
        icon={<i className="pi pi-fw pi-th-large"></i>}
        text="칸반 보드"
      />
      <TaskTotalScreen/>
      <div className={KanbanBoardStyle.kanbanDeleteTaskButtonDiv}>
      </div>
    </>
  );
}


import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Category } from "./Types";
import KanbanBoardStyle from "./KanbanBoard.module.css";
import { KanbanColumn } from "./Column";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

//API, Redux
import {callGetTasksAPI, callGetTasksSprintAPI} from "../../../apis/TaskAPICalls";
import { callGetProjectAPI } from "../../../apis/ProjectAPICalls";

export default function TaskTotalScreen(props) {
  
   
    // 일감 목록 
    const tasks = useSelector((state) => state.tasksReducer);
    const sprint = useSelector((state) => state.tasksSprintReducer);
    const dispatch = useDispatch();
    const { projectCode } = useParams();
    
    //프로젝트 이름
    const project = useSelector((state) => state.projectsReducer);
    
    useEffect(() => {
      dispatch(callGetTasksAPI(projectCode));
      dispatch(callGetTasksSprintAPI(projectCode));
      dispatch(callGetProjectAPI({projectCode: projectCode}));
    }, []);

    const filterBy = (category) => {
      if (tasks) {
        return tasks.filter((item) => item.progressStatus === category);
      }
    };

    const createKanbanColumn = (category) => (
      <KanbanColumn
        category={category}
        data={filterBy(category)}
      />
    );
    return (
      <div className={KanbanBoardStyle.kanbanContainer}>
        {Object.keys(sprint).length > 0 ? (
          <>
            <div className={KanbanBoardStyle.kanbanSprintName}>
              <div className={KanbanBoardStyle.kanbanSprintNameCard}>
                <div className={KanbanBoardStyle.kanbanSprintNameFront}>
                  <h4>
                    [ 프로젝트 ] <br />
                    <br />
                    {project.length > 0 && project[0].projectName}
                  </h4>
                </div>
                <div className={KanbanBoardStyle.kanbanSprintNameBack}>
                  <h4>
                    [ 진행 중인 스프린트 ] <br />
                    <br />
                    {sprint.sprintName}
                  </h4>
                </div>
              </div>
            </div>

            <div className={KanbanBoardStyle.kanbanColumnBacklog}>
              {createKanbanColumn(Category.Backlog)}
            </div>
            <div className={KanbanBoardStyle.kanbanColumnBefore}>
              {createKanbanColumn(Category.Before)}
            </div>
            <div className={KanbanBoardStyle.kanbanColumnInProgress}>
              {createKanbanColumn(Category.InProgress)}
            </div>
            <div className={KanbanBoardStyle.kanbanColumnDone}>
              {createKanbanColumn(Category.Done)}
            </div>
          </>
        ) : (
          <>
            <div className={KanbanBoardStyle.emptyOngoingSprint}>
              <div className={KanbanBoardStyle.kanbanColumnOnlyBacklog}>
                <h3>
                  {project.length > 0 && project[0].projectName}
                </h3>
                {createKanbanColumn(Category.Backlog)}
              </div>

              <div className={KanbanBoardStyle.kanbanColumnNoSprint}>
                <div className={KanbanBoardStyle.kanbanColumnLogo}>
                  <i
                    className="pi pi-fw pi-th-large"
                    style={{ fontSize: "10em", transform: "rotate(90deg)" }}
                  />
                </div>
                <div className={KanbanBoardStyle.kanbanColumnNoSprintContent}>
                  <h1>진행 중인 스프린트가 없습니다.</h1>
                  <h2>
                    진행 중인 스프린트가 없을 경우, 일감을 생성하실 수 없습니다.
                  </h2>
                </div>
                <Link to={`/project/${projectCode}/gantt`}>
                  <button className={KanbanBoardStyle.kanbanColumnNoSprintBtn}>
                    스프린트 만들러 가기
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }




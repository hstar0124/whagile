const getConnection = require("../database/connection");
const TasksRepository = require("../repositories/tasks-repo");
const SprintRepository = require("../repositories/sprint-repo");

// 전체 일감 목록 조회
exports.getTasks = (params) => {
  return new Promise( async(resolve, reject) => {
    const connection = getConnection();

    const results = await TasksRepository.selectTasks(connection, params);
    // console.log("results: ", results);
    connection.end();

    resolve(results);
  });
};


// 개별 일감 조회
exports.findTaskByTaskCode = (taskCode) => {
  return new Promise((resolve, reject) => {
    const connection = getConnection();

    const results = TasksRepository.selectTaskbyTaskCode(connection, taskCode);

    connection.end();

    resolve(results);
  });
};


// 일감 히스토리 생성
createTaskHistory = () => {
    
    const taskHistory = {
        historyItem: [],    
        historyContent: '',  
        taskCode: 0,   
        projectCode: 0,   
        memberCode: 0
    };
    return taskHistory;
};


// 개별 일감 생성
exports.registNewTask = (task) => {

    return new Promise(async (resolve, reject) => {
      const connection = getConnection();
      connection.beginTransaction();

      try {
        const insertedNewTask = await TasksRepository.insertNewTask(connection, task);
        // console.log(insertedNewTask)

				const taskHistory = createTaskHistory();
        // console.log("taskHistory: ", taskHistory)
        // console.log("memberCode", task.backlogCreatorCode);

        let historyItem = ["요약*"];
         if (task.backlogDescription) {
           historyItem.push("설명");
         }
          if (task.progressStatus) {
            historyItem.push("진행상태");
          }
          if (task.issue > -1) {
            historyItem.push("이슈여부");
          }
          if (task.urgency) {
            historyItem.push("긴급도");
          }
          if (task.backlogChargerCode) {
            historyItem.push("담당자");
          }

        taskHistory.historyItem = historyItem;
        taskHistory.historyContent = "생성";
        taskHistory.taskCode = insertedNewTask.insertId;
        taskHistory.projectCode = task.projectCode;
        taskHistory.memberCode = task.backlogCreatorCode;
            
        await TasksRepository.insertTaskHistory(connection, taskHistory);
         
        connection.commit();

        const result = {insertedNewTask: insertedNewTask,};

        resolve(result);

      } catch (err) {
        connection.rollback();

        reject(err);
      } finally {
        connection.end();
      }
    });
};



// 개별 일감 수정
exports.editTask = (task) => {

  return new Promise(async (resolve, reject) => {
    const connection = getConnection();
    connection.beginTransaction();

    try {
      const prevTasks = await TasksRepository.selectTaskbyTaskCode(connection, task.backlogCode);
      const results = await TasksRepository.updateTask(connection, task);
      const prevTask = prevTasks[0];

      // console.log("prevTasks: ", prevTask);
      // console.log("task", task);

      const taskHistory = createTaskHistory();

      let historyItem = [];
      if (prevTask.backlogTitle !== task.backlogTitle) {
        historyItem.push("요약*");
      }
      if (prevTask.backlogDescription !== task.backlogDescription) {
        historyItem.push("설명");
      }
      if (prevTask.progressStatus !== task.progressStatus) {
        historyItem.push("진행상태");
      }
      if (prevTask.issue !== task.issue) {
        historyItem.push("이슈여부");
      }
      if (prevTask.urgency !== task.urgency) {
        historyItem.push("긴급도");
      }
      if (prevTask.backlogChargerCode !== task.backlogChargerCode) {
        historyItem.push("담당자");
      }

      taskHistory.historyItem = historyItem;
      taskHistory.historyContent = "수정";
      taskHistory.taskCode = task.backlogCode;
      taskHistory.projectCode = task.projectCode;
      taskHistory.memberCode = task.memberCode;

      if (historyItem.length > 0) {
        await TasksRepository.insertTaskHistory(connection, taskHistory);
      }

      connection.commit();

      resolve(results);
    } catch (err) {
      connection.rollback();
      console.log("err", err);

      reject(err);
    } finally {
      connection.end();
    }
  });
};



// 삭제 
exports.removeTask = (task) => {
  return new Promise(async (resolve, reject) => {
    const connection = getConnection();
    connection.beginTransaction();

    try {
      if (task.taskCategory === "백로그") {
        const removedTask = await TasksRepository.deleteTask(connection,task.taskCode);

        const taskHistory = createTaskHistory();
        console.log("taskHistory", taskHistory);

        taskHistory.historyItem = "백로그";
        taskHistory.historyContent = "삭제";
        taskHistory.taskCode = task.taskCode;
        taskHistory.projectCode = task.taskProjectCode;
        taskHistory.memberCode = task.memberCode;

        TasksRepository.insertTaskHistory(connection, taskHistory);


        connection.commit();
        resolve(removedTask);
      } else {
        const removedTask = await TasksRepository.removeTask(connection, task.taskCode);
        const taskHistory = createTaskHistory();

        taskHistory.historyItem = "일감";
        taskHistory.historyContent = "삭제 (백로그로 이동)";
        taskHistory.taskCode = task.taskCode;
        taskHistory.projectCode = task.taskProjectCode;
        taskHistory.memberCode = task.memberCode;

        TasksRepository.insertTaskHistory(connection, taskHistory);
        

        connection.commit();
        resolve(removedTask);
      }
    } catch (err) {
      connection.rollback();

      reject(err);
    } finally {
      connection.end();
    }
  });
};







// 일감(백로그) 히스토리 조회

exports.findAllTaskHistory = (params) => {
  return new Promise((resolve, reject) => {
    const connection = getConnection();

    const results = TasksRepository.selectTaskHistories(connection, params);

    connection.end();

    resolve(results);
  });
};


// 진행중인 스프린트의 일감 조회
exports.findTasksOnGoingSprint = (params) => {

  return new Promise(async (resolve, reject) => {

    const connection = getConnection();

    params.searchCondition = 'progress_status';
    params.searchValue = 'y';
    
    const onGoingSprint = await SprintRepository.selectSprints(connection, params);
    // console.log("ongoing",onGoingSprint);
    let tasks = [];
    if(onGoingSprint.length > 0) {
      tasks = await TasksRepository.selectTasks(connection, {
        sprintCode: onGoingSprint[0].sprintCode,
        backlogCategory: '일감'
      });
    }
    // console.log("tasks",tasks)
    connection.end();

    resolve(tasks);

  });
};

// 진행중인 스프린트
exports.findSprint = (params) => {

  return new Promise(async (resolve, reject) => {

    const connection = getConnection();

    params.searchCondition = 'progress_status';
    params.searchValue = 'y';

    const sprints = await SprintRepository.selectSprints(connection, params);
    // console.log("findSprint", sprints);
    connection.end();

    resolve(sprints);

  });
};



exports.editTaskDate = (params) => {

  return new Promise(async (resolve, reject) => {

    const connection = getConnection();
    connection.beginTransaction();

    try {

      const results = await TasksRepository.updateTaskDate(connection, params);
      
      connection.commit();

      resolve(results);
    } catch (err) {

      connection.rollback();

      reject(err);
    } finally {

      connection.end();
    }
  });
};

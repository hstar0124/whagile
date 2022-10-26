const tasksQuery = require("../database/tasks-query");
const TasksDTO = require("../dto/tasks/tasks-response-dto");
const TasksHistoryDTO = require("../dto/tasks/tasks-history-response-dto");


//전체 일감 목록 조회
exports.selectTasks = (connection, params) => {
  return new Promise((resolve, reject) => {
    const query = connection.query(
      tasksQuery.selectTasks(params),
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        const tasks = [];
        for (let i = 0; i < results.length; i++) {
          tasks.push(new TasksDTO(results[i]));
        }
        resolve(tasks);
      }
    );
  });
};

// 개별 일감 조회
exports.selectTaskbyTaskCode = (connection, taskCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      tasksQuery.selectTaskbyTaskCode(),
      [parseInt(taskCode)],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        const tasks = [];
        for (let i = 0; i < results.length; i++) {
          tasks.push(new TasksDTO(results[i]));
        }

        resolve(tasks);
      }
    );
  });
};

// 개별 일감 생성
exports.insertNewTask = (connection, params) => {

    return new Promise((resolve, reject) => {
      
        connection.query(
          tasksQuery.insertNewTask(),
          [
            params.backlogTitle,
            params.backlogDescription,
            params.progressStatus,
            params.urgency,
            params.backlogChargerCode,
            params.backlogCategory,
            params.sprintCode,
            params.projectCode,
            params.backlogCreatorCode,
            params.issue,
          ],
          (err, results, fields) => {
            if (err) {
              reject(err);
            }
            resolve(results);
          }
        );
    });
};



// 개별 일감 수정
exports.updateTask = (connection, params) => {
  return new Promise((resolve, reject) => {
    
    connection.query(
      tasksQuery.updateTask(params),
      [
        params.backlogTitle,
        params.backlogDescription,
        params.progressStatus,
        params.urgency,
        params.backlogCategory,
        params.backlogChargerCode,
        params.issue,
        params.backlogCode,
      ],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      }
    );
  });
};

// 개별 백로그 삭제

exports.deleteTask = (connection, taskCode) => {

    return new Promise((resolve, reject) => {
        connection.query(
            tasksQuery.deleteTask(),
            [ taskCode ],
            (err, results, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    });
};


// 개별 일감 삭제
exports.removeTask = (connection, taskCode) => {
  return new Promise((resolve, reject) => {
    connection.query(
      tasksQuery.removeTask(),
      [taskCode],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      }
    );
  });
};


// 일감(백로그) 히스토리 생성
exports.insertTaskHistory = (connection, params) => {
  // console.log("params",params)
  // console.log("memberCode", params.backlogCreatorCode);
  return new Promise((resolve, reject) => {
    connection.query(
      tasksQuery.insertTaskHistory(),
      [
        params.historyItem.toString(),
        params.historyContent,
        params.taskCode,
        params.projectCode,
        params.memberCode,
      ],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      }
    );
  });
};



// 전체 일감 (백로그) 히스토리 조회
exports.selectTaskHistories = (connection, params) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
          tasksQuery.selectTaskHistories(),
          (err, results, fields) => {
            if (err) {
              reject(err);
            }

            const tasksHistories = [];
            for (let i = 0; i < results.length; i++) {
              tasksHistories.push(new TasksHistoryDTO(results[i]));
            }

            resolve(tasksHistories);
          }
        );
        
    });
};


// 개별 일감(백로그) 히스토리 조회
exports.selectTaskHistorybyHistoryCode = (connection, historyCode) => {
  // console.log("historyCode", historyCode);
  return new Promise((resolve, reject) => {
    connection.query(
      tasksQuery.selectTaskHistorybyHistoryCode(),
      historyCode,
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      }
    );
  });
};



// 일감 시작일, 종료일만 수정
exports.updateTaskDate = (connection, params) => {

  return new Promise((resolve, reject) => {

    connection.query(
      tasksQuery.updateTaskDate(),
      [
        params.taskStartDate
        , params.taskEndDate
        , params.taskCode
      ],
      (err, results, fields) => {
        if (err) {
          reject(err);
        }

        resolve(results);
      }
    );
  });
}
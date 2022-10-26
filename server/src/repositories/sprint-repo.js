const sprintQuery = require('../database/sprint-query');
const SprintDTO = require('../dto/sprint/sprint-response-dto');
const SprintHistoryDTO = require('../dto/sprint/sprintHistory-response-dto');
const TasksDTO = require("../dto/tasks/tasks-response-dto");

exports.insertSprint = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(
            sprintQuery.insertSprint(),
            [
                  params.sprintName
                , (params.sprintTarget)? params.sprintTarget: null
                , (params.sprintStartDate)? params.sprintStartDate: null
                , (params.sprintEndDate)? params.sprintEndDate: null
                , parseInt(params.currentInfo.projectCode)
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                
                resolve(results);
            }
        );
    });
}

exports.selectSprints = (connection, params) => {
    
    return new Promise((resolve, reject) => {
        
        connection.query(
            sprintQuery.selectSprints(params),
            [params.projectCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                const sprints = [];
                for(let i = 0; i < results.length; i++) {
                    sprints.push(new SprintDTO(results[i]));
                }

                resolve(sprints);
            }
        );
    });
}

exports.selectSprintHistory = (connection, params) => {
    
    return new Promise((resolve, reject) => {

        connection.query(
            sprintQuery.selectSprintHistory(params), 
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                const sprintHistory = [];
                for(let i = 0; i < results.length; i++) {
                    sprintHistory.push(new SprintHistoryDTO(results[i]));
                }

                resolve(sprintHistory);
            }
        );
    });
}

exports.selectSprint = (connection, sprintCode) => {
    
    return new Promise((resolve, reject) => {

        connection.query(
            sprintQuery.selectSprint(),
            [sprintCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                
                const sprint = [];
                for(let i = 0; i < results.length; i++) {
                    sprint.push(new SprintDTO(results[i]));
                }
    
                resolve(sprint);
            }
        );
    });
}

exports.updateSprint = (connection, params) => {
    
    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.updateSprint(),
            [
                params.sprintName
                , params.sprintTarget
                , params.sprintStartDate
                , params.sprintEndDate
                , params.sprintProgressStatus
                , params.sprintCode
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}

exports.deleteSprint = (connection, params) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.deleteSprint(),
            [params.sprintCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })    
}

exports.selectTasks = (connection, params) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.selectTasks(),
            [params.sprintCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }
                
                const tasks = [];
                for (let i = 0; i < results.length; i++) {
                  tasks.push(new TasksDTO(results[i]));
                }

                resolve(tasks);
            }
        );
    })    
}

exports.insertTask = (connection, params, currentInfo) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.insertTask(),
            [
                params.backlogTitle
                , params.backlogDescription
                , params.backlogUrgency
                , (params.backlogChargerCode)? params.backlogChargerCode: null
                , currentInfo.sprintCode
                , currentInfo.projectCode
                , currentInfo.backlogCreatorCode
                , params.backlogIssue
                , (params.backlogStartDate)? params.backlogStartDate: null
                , (params.backlogEndDate)? params.backlogEndDate: null
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })    
}

exports.updateBacklogToTask = (connection, params, currentInfo) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.updateBacklogToTask(),
            [
                currentInfo.sprintCode,
                params.backlogCode,
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}

exports.updateTaskToBacklogBySprintCode = (connection, sprintCode) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.updateTaskToBacklogBySprintCode(),
            [sprintCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}

exports.updateTaskToBacklogByBacklogCode = (connection, backlogCode) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.updateTaskToBacklogByBacklogCode(),
            [backlogCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}

exports.selectSprintsCount = (connection, params) => {

    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.selectSprintsCount(params),
            [params.projectCode],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}

exports.insertSprintHistory = (connection, sprintHistory, currentInfo) => {
    
    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.insertSprintHistory(),
            [
                sprintHistory.sprintHitoryItem.toString(),
                sprintHistory.sprintHistoryContent,
                currentInfo.sprintCode,
                currentInfo.memberCode,
                parseInt(currentInfo.projectCode),
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}

exports.updateSprintProgress = (connection, params) => {
    
    return new Promise((resolve, reject) => {
        
        connection.query(

            sprintQuery.updateSprintProgress(),
            [
                params.sprintProgressStatus,
                params.sprintCode
            ],
            (err, results, fields) => {
                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    })
}


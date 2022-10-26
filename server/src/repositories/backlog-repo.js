const backlogQuery = require('../database/backlog-query');
const BacklogDTO = require('../dto/backlog/backlog-response-dto');
const BacklogDetailDTO = require('../dto/backlog/backlog-detail-response-dto');
const BacklogHistoryDTO = require('../dto/backlog/backlog-history-response-dto');

/* 백로그 목록 조회를 요청하는 레파지토리 메소드 */
exports.selectBacklogs = (connection, params) => {

    return new Promise((resolve, reject) => {
        
        const query = connection.query(
            backlogQuery.selectBacklogs(params),
            (err, results, fields) => {
                
                if(err) {
                    reject(err);
                    console.log('err가 났어 ', err);
                }

                const backlogs = [];
                for(let i = 0; i < results.length; i++) {
                    backlogs.push(new BacklogDTO(results[i]));
                }

                resolve(backlogs);
            }
        );

        // console.log(query.sql);
    });
};

/* 개별 백로그 상세조회 요청 */
exports.selectBacklogByBacklogCode = (connection, backlogCode) => {

    return new Promise((resolve, reject) => {
        const query = connection.query(
            backlogQuery.selectBacklogByBacklogCode(),
            backlogCode,
            (err, results, fields) => {

                if(err) {
                    console.log(`repo에서 err 확인 : ${ err }`);
                    reject(err);
                }
                
                const backlog = [];
                for(let i = 0; i < results.length; i++) {
                        backlog.push(new BacklogDetailDTO(results[i]));
                    }
                    
                resolve(backlog);
            }
        );

        // console.log(query.sql);
    });
};

/* 새로운 백로그 생성 요청 */
exports.insertNewBacklog = (connection, backlog) => {

    return new Promise((resolve, reject) => {

        connection.query(
            backlogQuery.insertNewBacklog(),
            [backlog.title, backlog.description, backlog.category, backlog.urgency, backlog.issue, backlog.projectCode, backlog.creatorCode],
            (err, results, fields) => {

                if(err) {
                    console.log(`repo에서 err확인 : ${ err }`)
                    reject(err);
                }
                
                resolve(results);
            }
        );
    });
};

/* 백로그 히스토리 생성 요청 */
exports.insertBacklogHistory = (connection, newHistory) => {
    
    return new Promise((resolve, reject) => {

        const query = 
        connection.query(
            backlogQuery.insertBacklogHistory(), 
            [newHistory.historyItem, newHistory.historyContent, newHistory.backlogCode, newHistory.projectCode, newHistory.memberCode],
            (err, results, fields) => {

                if(err) {
                    console.log(`repo에서 err확인 : ${ err }`)
                    reject(err);
                }

                resolve(results);
            }
        );
        console.log(query.sql);
    });
};

/* 백로그 히스토리 조회 요청 */
exports.selectHistoryByHistoryCode = (connection, historyCode) => {

    return new Promise((resolve, reject) => {

        connection.query(
            backlogQuery.selectHistoryByHistoryCode(),
            historyCode,
            (err, results, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    });
};

/* 백로그 수정 요청 */
exports.editBacklog = (connection, modifyingContent) => {

    return new Promise((resolve, reject) => {
        const query = 
        connection.query(
            backlogQuery.editBacklog(modifyingContent),
            (err, results, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );

        console.log(query.sql);
    });
};

/* 백로그 삭제 요청 */
exports.deleteBacklog = (connection, backlogCode) => {

    return new Promise((resolve, reject) => {
        connection.query(
            backlogQuery.deleteBacklog(),
            backlogCode,
            (err, results, fields) => {

                if(err) {
                    reject(err);
                }

                resolve(results);
            }
        );
    });
};

/* 백로그 히스토리 조회 요청 */
exports.selectBacklogHistories = (connection, params) => {

    return new Promise((resolve, reject) => {

        const query = connection.query(
            backlogQuery.selectBacklogHistories(),
            [params.offset, params.limit],
            (err, results, fields) => {

                if(err) {
                    reject(err);
                }

                const backlogHistories = [];
                for(let i = 0; i < results.length; i++) {
                    backlogHistories.push(new BacklogHistoryDTO(results[i]));
                }

                resolve(backlogHistories);
            }
        );
        // console.log(query.sql);
    });
};
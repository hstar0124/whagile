const getConnection = require('../database/connection');
const AdminStatisticRepository = require('../repositories/admin-statistics-repo');

exports.viewCounts = () => {

    return new Promise(async (resolve, reject) => {

        const connection = getConnection();

        const result = await AdminStatisticRepository.selectCounts(connection);

        result.AVG_SPRINT_COUNT = Number(result.ALL_SPRINT_COUNT / result.ALL_PROJECT_COUNT).toFixed(2);
        result.AVG_TASK_COUNT = Number(result.ALL_TASK_COUNT / result.ALL_PROJECT_COUNT).toFixed(2);
        result.AVG_BACKLOG_COUNT = Number(result.ALL_BACKLOG_COUNT / result.ALL_PROJECT_COUNT).toFixed(2);
        result.UNANSWERED_INQUIRY_COUNT = Number(result.UNANSWERED_INQUIRY_COUNT);

        connection.end();

        resolve(result);
    });
};

exports.viewChartCounts = (params) => {

    return new Promise(async (resolve, reject) => {
        
        const connection = getConnection();

        const newUserCount = await AdminStatisticRepository.selectNewUserCount(connection, params);
        const resignedUserCount = await AdminStatisticRepository.selectResignedUserCount(connection, params);
        const newProjectCount = await AdminStatisticRepository.selectNewProjectCount(connection, params);
        const newSprintCount = await AdminStatisticRepository.selectNewSprintCount(connection, params);
        const deletedSprintCount = await AdminStatisticRepository.selectDeletedSprintCount(connection, params);
        const loginCount = await AdminStatisticRepository.selectLoginCount(connection, params);
        const visitorCount = await AdminStatisticRepository.selectVisitorCount(connection, params);
        
        const result = {
            newUserCount: newUserCount,
            resignedUserCount: resignedUserCount,
            newProjectCount: newProjectCount,
            newSprintCount: newSprintCount,
            deletedSprintCount: deletedSprintCount,
            loginCount: loginCount,
            visitorCount: visitorCount
        }
        
        connection.end();

        resolve(result);
    });
};
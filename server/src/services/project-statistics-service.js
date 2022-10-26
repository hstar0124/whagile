const getConnection = require('../database/connection');
const ProjectStatisticsRepository = require('../repositories/project-statistics-repo');

exports.findCountingTaskByProgressStatus = (projectCode) => {

    return new Promise((resolve, reject) => {

        const connection = getConnection();

        console.log('=========service=============',projectCode);
        const results = ProjectStatisticsRepository.selectCountingTaskByProgressStatus(connection, projectCode);

        connection.end();

        resolve(results);
    });
}
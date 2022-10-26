const projectStatisticsQuery = require('../database/project-statistics-query');
const ProjectStatisticsDTO = require('../dto/project/project-statistics-response-dto');

exports.selectCountingTaskByProgressStatus = (connection, projectCode) => {
    return new Promise((resolve, reject) => {
        connection.query(projectStatisticsQuery.selectCountingTaskByProgressStatus(projectCode), 
        (err, results, fields) => {
            console.log('results', results);

            if(err) {
                console.log(err);
                reject(err);
            }


            const projectStatistics = [];
            for(let i = 0; i < results.length; i++) {
                projectStatistics.push(new ProjectStatisticsDTO(results[i]));
            }

            console.log('project', projectStatistics);

            resolve(projectStatistics[0]);
        });
    });
};
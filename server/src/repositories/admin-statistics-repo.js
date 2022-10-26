const adminStatisticsQuery = require('../database/admin-statistics-query');

exports.selectCounts = (connection) => {

    return new Promise((resolve, reject) => {
        
        connection.query(adminStatisticsQuery.selectCounts(), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results[0]);
        });
    });
};

exports.selectNewUserCount = (connection, params) => {
    
    return new Promise((resolve, reject) => {
        
        connection.query(adminStatisticsQuery.selectNewUserCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.selectResignedUserCount = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(adminStatisticsQuery.selectResignedUserCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.selectNewProjectCount = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(adminStatisticsQuery.selectNewProjectCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.selectNewSprintCount = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(adminStatisticsQuery.selectNewSprintCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.selectDeletedSprintCount = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(adminStatisticsQuery.selectDeletedSprintCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.selectLoginCount = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(adminStatisticsQuery.selectLoginCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

exports.selectVisitorCount = (connection, params) => {

    return new Promise((resolve, reject) => {

        connection.query(adminStatisticsQuery.selectVisitorCount(params), 
        (err, results, fields) => {

            if(err) {
                reject(err);
            }

            resolve(results);
        });
    });
};

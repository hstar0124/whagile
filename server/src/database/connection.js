const mysql = require('mysql');
const connectionInfo = require('../config/db-config');

const getConnection = () => { 

    return mysql.createConnection(connectionInfo); 
}

module.exports = getConnection;
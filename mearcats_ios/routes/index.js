const express     = require('express');
const router          = express.Router();


/**********************
        MySQL 연동
**********************/
const mysql        = require('mysql');
const db_config    = require('../config/db_config.json');

//db connection 몇개 남았는 지 알려줘서 보내는 코드

global.pool = mysql.createPool({
    host : db_config.host,
    port : db_config.port,
    user : db_config.user,
    password : db_config.password,
    database : db_config.database,
    connectionLimit : db_config.connectionLimit
});

let LeftConnections = db_config.connectionLimit;
pool.on('acquire', function (connection) {
    LeftConnections--;
    if( LeftConnections < 5 ){
        console.log("DB Connections이 "+LeftConnections+"개 밖에 남지 않았습니다!");
    }
});

pool.on('enqueue', function () {
    console.log("DB Connections이 고갈됨");

});

pool.on('release', function (connection) {
    LeftConnections++;
});

pool.getConnection(function(err, connection) {
    if( err ){
        console.log("error 처리",err);
        return;
    }

    connection.ping(function (err) {
        if (err) throw err;
        console.log('db responded to ping');
    });
});

const ios = require('./ios');
router.use('/ios', ios);

module.exports = router;

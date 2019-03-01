const mysql = require('mysql');
const CONFIG = require('./config')

var conn = mysql.createConnection({
    host     : CONFIG.host,
    // host     : 'localhost',
    user     : CONFIG.user,
    password : CONFIG.password,
    database : CONFIG.database
});
 
conn.connect(err=>{
    if(err) console.log("数据库链接失败",err)
    else console.log("数据库链接成功")
});

// conn.query('SELECT * from student where studentID = "1440225120"', function (error, results, fields) {
//     if (error) throw error;
//     console.log('The solution is: ', results);
// });

module.exports = conn
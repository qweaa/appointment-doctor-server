var Client = require('easy_mysql');
const CONFIG = require('./config')
// a = {
//     host     : CONFIG.host,
//     // host     : 'localhost',
//     user     : CONFIG.user,
//     password : CONFIG.password,
//     database : CONFIG.database
// }

Client.config({
    'host' : CONFIG.host,
    'user' : CONFIG.user,
    'password' : CONFIG.password,
    'database' : CONFIG.database,
});


module.exports = Client

// mysql.query('SHOW DATABASES', function (error, res) {
//   console.log(res);
// });

// bind params
// mysql.query({
//   sql: 'select * from user where user =:user',
//   params: {user: 'xxoo'}
// }, function (err, rows) {
//   console.log(rows);
// });
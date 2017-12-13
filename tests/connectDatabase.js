function ConnectDatabase (){
var mysql = require('../node_modules/mysql');

this.connection = mysql.createConnection({
host : '127.0.0.1',
user : 'root',
password : '1234',
database: 'agil'
});
};
module.exports = ConnectDatabase;
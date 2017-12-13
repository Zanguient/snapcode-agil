function ConnectDatabase (){
var mysql = require('D:\alejandro hermosa\agil testing\trunk\node_modules\mysql');

this.connection = mysql.createConnection({
host : '127.0.0.1',
user : 'root',
password : 'root',
database: 'agil'
});
};
module.exports = ConnectDatabase;
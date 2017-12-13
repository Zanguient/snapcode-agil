var ConnectDatabase = require("D:\alejandro hermosa\agil testing\trunk\tests\PruebaConeccionDB\connectDatabase");
var connectDatabase = new ConnectDatabase();
connectDatabase.connection.connect();
 
 
describe('angularjs homepage todo list', function() {
 
    // E2E test
 
    /*it('should add a todo', function(done) {
        browser.get('http://localhost:8083');
 
        element(by.model('todoList.todoText')).sendKeys('write first protractor test');
        element(by.css('[value="add"]')).click();
 
        var todoList = element.all(by.repeater('todo in todoList.todos'));
        expect(todoList.count()).toEqual(3);
        expect(todoList.get(2).getText()).toEqual('write first protractor test');
 
        console.log("teststststs");
 
        // You wrote your first test, cross it off the list
        todoList.get(2).element(by.css('input')).click();
        var completedAmount = element.all(by.css('.done-true'));
        expect(completedAmount.count()).toEqual(2);
    });*/
 
 
    // Test which interacts with MySql DB
 
    it('Should add', function(done) {
 
        var sql = 'SELECT * FROM inv_cotizacion LIMIT 5';
        console.log("testing");
        connectDatabase.connection.query(sql, function(err, rows) {
 
            if (!err) {
                console.log("solution is :", rows);
            }
            done(err);
        });
    });
 
});
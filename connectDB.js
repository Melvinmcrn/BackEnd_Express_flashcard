var mysql = require('mysql')
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'indiv2019_1'
})
try {
    connection.connect();
} catch (err) {
    console.error(err);
}

exports.getTable = function (query, callback) {
    console.log("connectDB/getTable");
    console.log("query: " + query);
    var output;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error("connectDB err: " + err);
            output = new Object;
        } else {
            console.log("Connection successful!");
            output = rows;
        }
        return callback(output);
    })

}

exports.insertUpdateDelete = function (query) {
    connection.connect();
    connection.query(query, function (err, rows, fields) {
        if (err) throw err
    });
    connection.end();
}
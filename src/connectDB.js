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
    // console.log("connectDB/getTable");
    // console.log("query: " + query);
    var output;
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error("[ERROR] connectDB err: " + err);
            output = new Object;
        } else {
            console.log("[SUCCESS] get table: " + query);
            output = rows;
        }
        return callback(output);
    })

}

exports.insertUpdateDelete = function (query) {
    // connection.connect();
    connection.query(query, function (err) {
        if (err) {
            console.error("[ERROR] connectDB err: " + err);
        } else {
            console.log("[SUCCESS] insertUpdateDelete: " + query);
        }
    });
    // connection.end();
}

exports.getUserbyToken = function (token, callback) {
    var output;
    let query = "SELECT * FROM user WHERE Token = " + token + ";";
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error("[ERROR] connectDB err: " + err);
            output = new Object;
        } else {
            console.log("[SUCCESS] get user by token: " + token);
            output = rows;
        }
        return callback(output);
    })
}

exports.getUserbyUsername = function (username, callback) {
    var output;
    let query = "SELECT * FROM user WHERE username = '" + username + "';";
    connection.query(query, function (err, rows, fields) {
        if (err) {
            console.error("[ERROR] connectDB err: " + err);
            output = new Object;
        } else {
            console.log("[SUCCESS] get user: " + username);
            output = rows;
        }
        return callback(output);
    })
}

exports.addTokenToUser = function (username, token, callback) {
    let query = "UPDATE user SET token = '" + token + "' WHERE username = '" + username + "';";
    connection.query(query, function (err) {
        if (err) {
            console.error("[ERROR] connectDB err: " + err);
            return callback(false);
        } else {
            console.log("[SUCCESS] insert token for user: " + username)
            return callback(true);
        }
    });
};

exports.addNewUser = function (username, email, password, callback) {
    let query = "INSERT INTO user (Username,Email,Password) VALUES('" + username + "', '"+ email + "', '" + password + "');";
    connection.query(query, function (err) {
        if (err) {
            console.error("[ERROR] connectDB err: " + err);
            return callback(false);
        } else {
            console.log("[SUCCESS] insert new user: " + username)
            return callback(true);
        }
    });
}
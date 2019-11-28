// IMPORT
const jwt = require("jwt-simple");
const connectDB = require("./connectDB");

// SECRET KEY
const SECRET = require('./data/key').SECRET_KEY;

// ทำ Middleware สำหรับขอ JWT
exports.loginMiddleWare = (req, res, next) => {
    if (!req.body || !req.body.credentials || !req.body.credentials.username || !req.body.credentials.password) {
        res.status(700).send("credentials not found");
        return;
    }

    let username = req.body.credentials.username;
    let password = req.body.credentials.password;

    console.log("[ATTEMPT LOGIN] username: " + username + " | password: " + password);

    connectDB.getUserbyUsername(username, (userTable) => {
        userTable = JSON.parse(JSON.stringify(userTable));

        // FOUND 0 ROW
        if (!userTable.length) {
            console.log("[LOGIN FAIL] not found user: " + username);
            res.status(701).send("[LOGIN FAIL] not found user: " + username);
            return;

        }

        userTable = userTable[0];
        // PASSWORD NOT MATCH
        if (userTable.Password !== password) {
            console.log("[LOGIN FAIL] wrong password for user: " + username);
            res.status(702).send("[LOGIN FAIL] wrong password for user: " + username);

            // LOGIN OK
        } else if (userTable.Username === username && userTable.Password === password) {
            next();

            // CASE ELSE
        } else {
            console.log("[LOGIN FAIL] don't know reason for user: " + username);
            res.status(703).send("[LOGIN FAIL] don't know reason for user: " + username);
        }

    });


};


// REGISTER NEW USER
exports.registerNewUser = (req, res) => {
    let username = req.body.credentials.username;
    let email = req.body.credentials.email;
    let password = req.body.credentials.password;

    connectDB.getUserbyUsername(username, (userTable) => {
        if (userTable.length) {
            console.log("[REGISTER FAIL] already exist user: " + username);
            res.status(705).send("[REGISTER FAIL] already exist user: " + username);
            return;
        }

        let errorMessage = '';
        if (username.length > 10) errorMessage += 'username length must <= 10 '
        if (email.length > 50) errorMessage += 'email length must <= 50 '
        if (password.length > 15) errorMessage += 'password length must <= 15 '
        if (errorMessage.length) {
            console.log("[REGISTER FAIL] " + errorMessage);
            res.status(706).send("[REGISTER FAIL] " + errorMessage);
            return;
        }

        connectDB.addNewUser(username, email, password, (result) => {
            if (result) {
                res.sendStatus(200);
            } else {
                res.status(707).send("[ERROR] error in adding user to DB");
            }
        });

    });
}


// GENERATE JWT TOKEN
exports.generateJWT = (req, res) => {
    let username = req.body.credentials.username;
    console.log("[LOGIN SUCCESS] username: " + username);
    const payload = {
        sub: username,
        iat: new Date().getTime()
    };
    let token = jwt.encode(payload, SECRET);
    connectDB.addTokenToUser(username, token, (result) => {
        if (result) {
            res.cookie("access-token", token, { httpOnly: true, maxAge: 5000000 }).send("LOGIN_SUCCESS " + Date.now());
        } else {
            res.status(704).send("[ERROR] error in adding token to DB");
        }
    });

};
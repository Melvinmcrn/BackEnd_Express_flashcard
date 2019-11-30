//passport.js

const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const connectDB = require("./connectDB");
const SECRET = require('./data/key').SECRET_KEY;
const cookieParser = require('cookie-parser');
passport.use(cookieParser());

const cookieExtractor = (req) => {
    // console.log("cookie extractor");
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['access-token']
    };
    // console.log(token);
    return token;
};


// JWT Strategy ######################################################################################

passport.use(new JWTStrategy({
    jwtFromRequest: req => cookieExtractor(req),
    secretOrKey: SECRET
},
    (jwtPayload, done) => {
        let username = jwtPayload.sub;

        // NO TOKEN FOUND
        if (jwtPayload === null) return done(null, false);

        try {
            connectDB.getUserbyUsername(username, (userTable) => {
                userTable = JSON.parse(JSON.stringify(userTable));

                // FOUND 0 ROW
                if (!userTable.length) {
                    return done(null, false);
                } else {
                    return done(null, userTable);
                }

            });
        } catch (err) {
            return done(err, false);
        };
    
    }
));

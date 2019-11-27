//passport.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const CookieStrategy = require("passport-cookie");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const connectDB = require("./connectDB");

// COOKIE Strategy ####################################################################################
// passport.use(new CookieStrategy(
//     function (token, done) {
//         console.log(token);
//         // User.findByToken({ token: token }, function (err, user) {
//         //     if (err) { return done(err); }
//         //     if (!user) { return done(null, false); }
//         //     return done(null, user);
//         // });
//         let user;
//         return done(null, user);
//     }
// ));

// JWT Strategy ######################################################################################

passport.use(new JWTStrategy({
    // jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    jwtFromRequest: req => req.cookies.token,
    secretOrKey: 'MELVINMCRN'
},
    (jwtPayload, done) => {

        //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
        // return UserModel.findOneById(jwtPayload.id)
        return ((jwtPayload) => {
            console.log("JWT PAY LOAD");
            console.log(jwtPayload);
            return "melvinmcrn"
        })
            .then(user => {
                return done(null, user);
            })
            .catch(err => {
                return done(err, false);
            });
    }
));
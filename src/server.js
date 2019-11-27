const express = require("express"); // เสมือน import package มาใช้งาน
const app = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
const bodyParser = require("body-parser");
const passport = require('passport');
// const fs = require('fs');
const cookieParser = require('cookie-parser');
const func = require('./function');
const auth = require('./auth');
require('./passport');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(cookieParser());


app.use((req, res, next) => {
  req.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* import library ที่จำเป็นทั้งหมด */
const jwt = require("jwt-simple");
// const passport = require("passport");
//ใช้ในการ decode jwt ออกมา
const ExtractJwt = require("passport-jwt").ExtractJwt;
//ใช้ในการประกาศ Strategy
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "MY_SECRET_KEY";
//สร้าง Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: SECRET
};
const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
  if (payload.sub === "kennaruk") done(null, true);
  else done(null, false);
});
//เสียบ Strategy เข้า Passport
passport.use(jwtAuth);
//ทำ Passport Middleware
const requireJWTAuth = passport.authenticate("jwt", { session: false });
//เสียบ middleware ยืนยันตัวตน JWT เข้าไป
app.get("/", requireJWTAuth, (req, res) => {
  res.send("ยอดเงินคงเหลือ 50");
});

// [DONE] login with username and password -> set access-token in cookies
app.post("/login", auth.loginMiddleWare, (req, res) => {
  auth.generateJWT(req, res);
});

app.post("/register", (req, res) => {
  auth.registerNewUser(req, res);
});

app.get("/", (req, res) => {
  // server จะสามารถส่งทั้ง header ต่างๆหรือจะตัวหนังสือ json อะไรก็ได้กลับไป
  res.send("Hello World!");
});

// [DONE] return JSON file of Deck_ID and Deck_Name
app.get("/CardDeck", func.getAllDeck);

// [DONE] return JSON file of Word in selected Deck
app.get("/CardDeck/:DeckName", func.getDeck);

// server จะรันที่ port 3000 หรือ port ใดๆก็ตามใจเราและ callback จะทำงานเมื่อ
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log('Server Listen At ' + String(PORT));
});
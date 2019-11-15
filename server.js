const express = require("express"); // เสมือน import package มาใช้งาน
const app = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
const bodyParser = require("body-parser");
app.use(express.static('public'));
app.use(bodyParser.json());

var func = require('./function');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* import library ที่จำเป็นทั้งหมด */
const jwt = require("jwt-simple");
const passport = require("passport");
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
//ทำ Middleware สำหรับขอ JWT
const loginMiddleWare = (req, res, next) => {
  console.log("[ATTEMPT LOGIN] username: " + req.body.username + " password: " + req.body.password);
  if (req.body.username === "melvinmcrn"
    && req.body.password === "7153798") {
    next();
  } else {
    console.log("[LOGIN FAIL]");
    res.json("LOGIN_FAIL");
  }
};
app.post("/login", loginMiddleWare, (req, res) => {
  console.log("[LOGIN SUCCESS] username: " + req.body.username);
  const payload = {
    sub: req.body.username,
    iat: new Date().getTime()
  };
  let token = jwt.encode(payload, SECRET);

  fs.readFile('myjsonfile.json', 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    obj = JSON.parse(data); //now it an object
    obj.table.push({id: 2, square:3}); //add some data
    json = JSON.stringify(obj); //convert it back to json
    fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
}});
  res.json(token);
});

app.post("/register", (req, res) => {
  console.log(req.body);
  res.json("melvin5555555555555");
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
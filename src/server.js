const express = require("express"); // เสมือน import package มาใช้งาน
const app = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
const bodyParser = require("body-parser");
const passport = require('passport');
const cookieParser = require('cookie-parser');
const func = require('./function');
const auth = require('./auth');
require('./passport');

const requireJWTAuth = passport.authenticate("jwt", {session: false});

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

// [DONE] login with username and password -> set access-token in cookies
app.post("/login", auth.loginMiddleWare, (req, res) => {
  auth.generateJWT(req, res);
  req.cookies
});

// [DONE] register
app.post("/register", (req, res) => {
  auth.registerNewUser(req, res);
});

// [DONE] return JSON file of Deck_ID and Deck_Name
app.get("/CardDeck",requireJWTAuth, func.getAllDeck);

// [DONE] return JSON file of Word in selected Deck
app.get("/CardDeck/:DeckName", func.getDeck);

// server จะรันที่ port 3000 หรือ port ใดๆก็ตามใจเรา
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log('Server Listen At ' + String(PORT));
});
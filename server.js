var express = require("express"); // เสมือน import package มาใช้งาน
var app = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
app.use(express.static('public'));

var connectDB = require('./connectDB');
var func = require('./function');

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
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
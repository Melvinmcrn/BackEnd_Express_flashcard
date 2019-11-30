var express = require("express"); // เสมือน import package มาใช้งาน
var app = express(); // สร้าง Express Application ลองกด ctrl + คลิกเข้าไปดูในไส้ใน
app.use(express.static('public'));

var connectDB = require('./connectDB');

// Accepts the array and key
const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};

exports.getAllDeck = function (req, res) {

    // console.log("/CardDeck");
    let data = "";
    connectDB.getTable("SELECT DECK_NAME FROM DECK;", function (output) {
        data = output.map(obj => {
            return obj["DECK_NAME"];
        });
        // console.log(data)
        res.json(data);
    });
}

exports.getDeck = function (req, res) {
    let DeckName = req.params.DeckName;
    // console.log("/CardDeck/" + DeckName);
    let data = "";
    connectDB.getTable("SELECT WORD_ID, WORD FROM indiv2019_1.deckword \
                        WHERE DECK_NAME = '" + DeckName + "'\
                        order by WORD_ID, SEQ;", function (output) {

        data = output.reduce((acc, it) => {
            (acc[it.WORD_ID] = acc[it.WORD_ID] || []).push(it.WORD);
            return acc;
        }, {});
        res.json(data);
    });

}
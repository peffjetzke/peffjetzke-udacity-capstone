/*Variables*/
let travelData = {};

/*Setup Server*/
const express = require('express');
const app = express();

/*Middleware*/
const bodyParser = require('body-parser');
const cors = require('cors');

/*bodyParser returns the depreciated warning. Including it instead of express to stay inline with rubric*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

//point at the correct client folder
app.use(express.static('root'));

/*Start Server w/ callback*/
const port = 8081;
const server = app.listen(port, listening);

function listening(){
  console.log("Server running");
  console.log(`Running on localhost: ${port}`);
}

/*Get*/
// GET method route

function getData(req, res) {
    res.send(travelData);
  }

app.get('/all', getData) 

/*Post*/
function postData(req, res) {
    let reqData = req.body;

    console.log("Check request data: ", reqData);

    travelData["duration"] = reqData.duration;
    travelData["lat"] = reqData.lat;
    travelData["lon"] = reqData.lon;
    travelData["city"] = reqData.city;
    travelData["country"] = reqData.country;
    travelData["current"] = reqData.current;
    travelData["high"] = reqData.high;
    travelData["low"] = reqData.low;
    travelData["desc"] = reqData.desc
    travelData["imgsrc"] = reqData.imgsrc;

    res.send(travelData);
    console.log(travelData + "server debug");
  }

  app.post('/add', postData);
/*Variables*/
let travelData = [];
let formData= {};
let forecastData = {};

const dotenv = require('dotenv');
dotenv.config();
const fetch = require('node-fetch');

/*Setup Server*/
const express = require('express');
const app = express();

/*Middleware*/
const bodyParser = require('body-parser');
const cors = require('cors');
const { response } = require('express');

/*bodyParser returns the depreciated warning. Including it instead of express to stay inline with rubric*/
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cors());

//point at the correct client folder
app.use(express.static('root'));

/*Start Server w/ callback*/
const port = 8081;
const server = app.listen(port, listening);


/*API Variables*/
const geoURL = "http://api.geonames.org/searchJSON?";
let geoHits = "&maxRows=1"; //&maxRows=1 if we need to change the returns
const geoKey = process.env.GEO_KEY;

const weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?"; 
let weatherLat = ""; //&lat=
let weatherLon = ""; //&lon=
let units = "units=I"
const weatherKey = process.env.BIT_KEY;

const pixabayURL = "https://pixabay.com/api/?key=";
let pixabaySearch = ""; //&q=searchterm
let pixabayImage = "&image_type=photo"; //&image_type=imagetype
const pixKey = process.env.PIX_KEY;

/*API Calls*/
const getCoordinates = async (url)=>{ //updated to use URL first, which will be passed an actual url
  const res = await fetch(url) 
  try{
      const data = await res.json();
      return data;
  } catch(error){
      console.log("There was a problem", error);
  }
}

const getWeather = async (fullWeatherURL)=>{ 
  const res = await fetch(fullWeatherURL) 
  try{
      const data = await res.json();
      return data;
  } catch(error){
      console.log("There was a problem", error);
  }
}

const getImage = async (pixFullURL)=>{ 
  const res = await fetch(pixFullURL) 
  try{
      const data = await res.json();
      return data;
  } catch(error){
      console.log("There was a problem", error);
  }
}

function callAPIs() {
  let city = formData.city;
  let country = formData.country;
  let fullGeoURL = geoURL+"q="+city+"&country="+country+geoHits+"&username="+geoKey;

  console.log("City: ", city);
  console.log("Country: ", country);
  console.log("GeoURL: ", fullGeoURL); 

  travelData.push(formData);
  
  getCoordinates(fullGeoURL)
  .then((coordData)=>{
    const lon = coordData.geonames[0].lng;
    const lat = coordData.geonames[0].lat;
    //console.log("Coords are : ", lat + " " + lon);
    let fullWeatherURL = weatherURL+units+"&lat="+lat+"&lon="+lon+"&key="+weatherKey;
    //console.log("Weater URL is: ", fullWeatherURL)
    const weatherData = getWeather(fullWeatherURL);
    return weatherData;
  })
  .then((weatherData)=>{
    //console.log("Weater: ", weatherData);
    let days = formData.forecastDays;
    if(days<=1){
      let forecastData = {
        temp: weatherData.data[0].temp,
        high: weatherData.data[0].high_temp,
        low: weatherData.data[0].low_temp,
        desc: weatherData.data[0].weather.description,
        icon: weatherData.data[0].weather.icon
      }
     //console.log("Forecast Data: ", forecastData);
      travelData.push(forecastData);
      //console.log("Updated Travel Data: ", travelData);
      return travelData;

    }else if (days>=16) {
      let forecastData = {
        high: weatherData.data[15].high_temp,
        low: weatherData.data[15].low_temp,
        desc: weatherData.data[15].weather.description,
        icon: weatherData.data[0].weather.icon
      }
      travelData.push(forecastData);
      return travelData;

  }else{
    let forecastData = {
        high: weatherData.data[days].high_temp,
        low: weatherData.data[days].low_temp,
        desc: weatherData.data[days].weather.description,
        icon: weatherData.data[days].weather.icon,
    }
      travelData.push(forecastData);
      return travelData;
      //return forecastData;
    }
  })
  .then((travelData)=>{
    let pixFullURL = pixabayURL+pixKey+pixabayImage+"&q="+travelData[0].city; //was formData
    //console.log("Pix URL: ", pixFullURL);
    const imageSrc = getImage(pixFullURL);
    return imageSrc;
  })
  .then((imageSrc)=>{
    if(imageSrc.hits.length == 0){
      let imgsrc = "url('./media/default.jpg')"; 
      //document.body.style.backgroundImage = "url('./media/default.jpg')";
      travelData.push(imgsrc); //was formData
      //console.log("Final Travel Update: ", travelData);
      return travelData; //was formData
    }else{
      let i = Math.floor(Math.random()*imageSrc.hits.length);
      let imgURL = imageSrc.hits[i].largeImageURL;     
      // console.log(imgURL);
      let imgsrc = "url("+imgURL+")";
      //document.body.style.backgroundImage = "url("+imgURL+")";
      //imgsrc.push(travelData); //was formData
      travelData.push(imgsrc);
      //console.log("Final Travel Update: ", travelData);
      return travelData;
    }
  })
}

/*Get*/
function getData(req, res) {
    let returnData = callAPIs();
    res.send(returnData);
  }

app.get('/all', getData) 


app.post('/add', getFormData);

function getFormData(req, res){
    let reqData = req.body;

    formData["city"] = reqData.city;
    formData["country"] = reqData.country;
    formData["forecastDays"] = reqData.forecastDays;
    formData["duration"] = reqData.duration;
    
    console.log(formData);
    let returnData = "Thanks! Request received!"; 
    res.send(returnData); //send back data
}

/*Post*/
// function postData(req, res) {
//     let reqData = req.body;

//     console.log("Check request data: ", reqData);

//     travelData["duration"] = reqData.duration;
//     travelData["lat"] = reqData.lat;
//     travelData["lon"] = reqData.lon;
//     travelData["city"] = reqData.city;
//     travelData["country"] = reqData.country;
//     travelData["current"] = reqData.current;
//     travelData["high"] = reqData.high;
//     travelData["low"] = reqData.low;
//     travelData["desc"] = reqData.desc
//     travelData["imgsrc"] = reqData.imgsrc;
//     travelData["forecastDays"] = reqData.forecastDays;
//     travelData["icon"] = reqData.icon;
//     travelData["bgImg"] = reqData.bgImg;

//     res.send(travelData);
//     console.log(travelData + "server debug");
//   }


//Moved listening as last funciton for better logging?
function listening(){
  console.log("Server running");
  console.log(`Running on localhost: ${port}`);
}
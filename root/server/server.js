/*Variables*/
let travelData = {};
let formData= {};
let forecastData = {};

const dotenv = require('dotenv');
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

function listening(){
  console.log("Server running");
  console.log(`Running on localhost: ${port}`);
}

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

let city = formData.city;
let country = formData.country;
let fullGeoURL = geoURL+"q="+city+"&country="+country+geoHits+"&username="+geoKey;

/*API Calls*/
const getCoordinates = async (fullGeoURL)=>{ //can this just be used generically?
  const res = await fetch(fullGeoURL) 
  try{
      const data = await res.json();
      return data;
  } catch(error){
      console.log("There was a problem", error);
  }
}

const getWeather = async (fullWeatherURL)=>{ //can this just be used generically? 
  const res = await fetch(fullWeatherURL) //baseURL+zip+apiKey+units
  try{
      const data = await res.json();
      return data;
  } catch(error){
      console.log("There was a problem", error);
  }
}

const getImage = async (pixFullURL)=>{ //can this just be used generically? 
  const res = await fetch(pixFullURL) //baseURL+zip+apiKey+units
  try{
      const data = await res.json();
      return data;
  } catch(error){
      console.log("There was a problem", error);
  }
}

function callAPIs() {
  getCoordinates()
  .then(function(coordData){
      //console.log(data); //returning data here
      const lon = coordData.geonames[0].lng;
      const lat = coordData.geonames[0].lat;
      let fullWeatherURL = weatherURL+units+"&lat="+lat+"&lon="+lon+"&key="+weatherKey;
      const weatherData = getWeather(fullWeatherURL);
      return weatherData;
  })
  .then((weatherData)=>{
    let forecastDays = formData.forecastDays;
    if(forecastDays<=1){
      let forecastData = {
        temp: weatherData.data[0].temp,
        high: weatherData.data[0].high_temp,
        low: weatherData.data[0].low_temp,
        desc: weatherData.data[0].weather.description,
        icon: weatherData.data[0].weather.icon
      }
      forecastData.push(formData)
      return formData;

    }else if (forecastDays>=16) {
      let forecastData = {
        high: weatherData.data[15].high_temp,
        low: weatherData.data[15].low_temp,
        desc: weatherData.data[15].weather.description,
        icon: weatherData.data[0].weather.icon
      }
      forecastData.push(formData)
      return formData;

  }else{
    let forecastData = {
        high: weatherData.data[forecastDays].high_temp,
        low: weatherData.data[forecastDays].low_temp,
        desc: weatherData.data[forecastDays].weather.description,
        icon: weatherData.data[0].weather.icon,
    }
      forecastData.push(formData)
      return formData;
      //return forecastData;
    }
  })
  .then((formData)=>{
    let pixFullURL = pixabayURL+pixKey+pixabayImage+"&q="+formData.city;
    const imageSrc = getImage(pixFullURL);
    return imageSrc;
  })
  .then((imageSrc)=>{
    if(imageSrc.hits.length == 0){
      let imgsrc = "url('./media/default.jpg')"; 
      //document.body.style.backgroundImage = "url('./media/default.jpg')";
      imgsrc.push(formData);
      return formData; 
    }else{
      let i = Math.floor(Math.random()*imageSrc.hits.length);
      let imgURL = imageSrc.hits[i].largeImageURL;     
      // console.log(imgURL);
      let imgsrc = "url("+imgURL+")";
      //document.body.style.backgroundImage = "url("+imgURL+")";
      imgsrc.push(formData);
      formData.push(travelData);
      console.log(travelData);
      return travelData;
    }
  })
}

console.log(travelData);

/*Get*/
function getData(req, res) {
    res.send(travelData);
  }

app.get('/all', getData) 

function getFormData(req, res){
    let reqData = req.body;

    formData["city"] = reqData.city;
    formData["country"] = reqData.country;
    formData["forecastDays"] = reqData.forecastDays;
    formData["duration"] = reqData.duration;
    res.send(callAPIs());
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

  app.post('/add', getFormData);
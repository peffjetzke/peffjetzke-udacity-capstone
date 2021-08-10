/*Imports*/
//import { calcDays } from './js/calc'


/*API Variables*/
const geoURL = "http://api.geonames.org/searchJSON?"; //"http://api.geonames.org/searchJSON?q=london&username=demo"
let geoHits = "&maxRows=1"; //&maxRows=1 if we need to change the returns
const geoKey = "udacitypeff";

const weatherURL = "https://api.weatherbit.io/v2.0/forecast/daily?"; //"https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=API_KEY&include=minutely"; 
let weatherLat = ""; //&lat=
let weatherLon = ""; //&lon=
let units = "units=I"
const weatherKey = "a705ae9dfa214e6b84d2b9425fc8d31b";

//https://api.weatherbit.io/v2.0/forecast/daily?units=I&lat=47.60621&lon=-122.33207&key=a705ae9dfa214e6b84d2b9425fc8d31b

const pixabayURL = "https://pixabay.com/api/?key=";
let pixabaySearch = ""; //&q=searchterm
let pixabayImage = "&image_type=photo"; //&image_type=imagetype
const pixKey="22706625-414ce5abd7dca429882197d31";

//Button event listeners
// document.getElementById("generate").addEventListener("click", generatePage);
// document.getElementById("reset").addEventListener("click", resetPage);

/*Create new trip button event*/
function resetPage(e){
    event.preventDefault()
    location.reload();
}
//Function for event listener
function generatePage(e){
    event.preventDefault()
    
    /*Start with data validation*/
    if(document.getElementById("city_form").value == "")
    {
        alert("Please Enter a City");
    }else if(document.getElementById("country_form").value == "")
    {
        alert("Please Enter a Country"); 
    }else if(document.getElementById("start").value =="")
    {
        alert("Please select a start date."); 
    }else if(document.getElementById("end").value =="")
    {
        alert("Please select an end date."); 
    }else{
        let city = document.getElementById("city_form").value;
        let country = document.getElementById("country_form").value;

        /*Date Variables*/
        let startDate = new Date(document.getElementById("start").value);
        let endDate = new Date(document.getElementById("end").value);
        let today = new Date();

        console.log("Start: ", startDate);
        console.log("End: ", endDate);

        /*Setup first API call to Geonames*/
        let fullGeoURL = geoURL+"q="+city+"&country="+country+geoHits+"&username="+geoKey;

        /*Start chaining promises*/
        getCoordinates(fullGeoURL)
        .then(function(data){
            //console.log(data); //returning data here
            const lon = data.geonames[0].lng;
            const lat = data.geonames[0].lat;
            console.log("Coords: ", lat + ", " + lon);
            document.getElementById("lat").innerHTML = "Lat: " + lon;
            document.getElementById("lon").innerHTML = "Lon: " + lat;
            let fullWeatherURL = weatherURL+units+"&lat="+lat+"&lon="+lon+"&key="+weatherKey;
            console.log(fullWeatherURL);
            const weatherData = getWeather(fullWeatherURL);
            return weatherData;
            //postData('/add', {temp: data.main.temp , date: today, feelings: feelings}) JUST COMMETED
        })
        .then((weatherData)=>{
            console.log(weatherData);

            /*Checking how far out the date is for the weather*/
            let forecastDays = calcDays(endDate, today);

            console.log("Forcast Days: ", forecastDays);
            if(forecastDays<=1){
                let temp = weatherData.data[0].temp
                let high = weatherData.data[0].high_temp;
                let low = weatherData.data[0].low_temp;
                let desc = weatherData.data[0].weather.description;
                let icon = weatherData.data[0].weather.icon;

                console.log("High: ", high);
                console.log("Low: ", low);
                console.log("Description : ", desc);
                console.log("Current Weather: ", temp);
                document.getElementById("current").innerHTML = "Curent: " + temp + " F";
                document.getElementById("high").innerHTML = "High: " + high + " F";
                document.getElementById("low").innerHTML = "Low: " + low + " F";
                //document.getElementById("icon").imageSrc = "https://www.weatherbit.io/static/img/icons/" + icon + ".png";
                document.getElementById("icon").setAttribute("src", "https://www.weatherbit.io/static/img/icons/" + icon + ".png");
                console.log("https://www.weatherbit.io/static/img/icons/" + icon + ".png");
                document.getElementById("description").innerHTML = desc;

            }else if (forecastDays>=16) {
                let high = weatherData.data[15].high_temp;
                let low = weatherData.data[15].low_temp;
                let desc = weatherData.data[15].weather.description;
                let icon = weatherData.data[0].weather.icon;

                document.getElementById("current").remove();
                document.getElementById("high").innerHTML = "High: " + high + " F";
                document.getElementById("low").innerHTML = "Low: " + low + " F";
                document.getElementById("icon").setAttribute("src", "https://www.weatherbit.io/static/img/icons/" + icon + ".png");
                document.getElementById("description").innerHTML = desc;
            }else{
                let high = weatherData.data[forecastDays].high_temp;
                let low = weatherData.data[forecastDays].low_temp;
                let desc = weatherData.data[forecastDays].weather.description;
                let icon = weatherData.data[0].weather.icon;
                
                document.getElementById("current").remove();
                document.getElementById("high").innerHTML = "High: " + high + " F";
                document.getElementById("low").innerHTML = "Low: " + low + " F";
                document.getElementById("icon").setAttribute("src", "https://www.weatherbit.io/static/img/icons/" + icon + ".png");
                document.getElementById("description").innerHTML = desc;

            }
            
            let city = weatherData.city_name
            let country = weatherData.country_code

            console.log("Location", city + " " + country);
            document.getElementById("city").innerHTML = "City: " + city;
            document.getElementById("country").innerHTML = "Country: " + country;

            let pixFullURL = pixabayURL+pixKey+pixabayImage+"&q="+city;
            console.log(pixFullURL); 
            const imageSrc = getImage(pixFullURL);
            console.log(imageSrc);
            return imageSrc;
            //postData('/add', {temp: data.main.temp , date: today, feelings: feelings}) JUST COMMETED
        })
        .then((imageSrc)=>{
            console.log(imageSrc);
            console.log("Array length: ", imageSrc.hits.length); //debug checking array length
            console.log("Random element: ", Math.floor(Math.random()*imageSrc.hits.length)); //debug getting random array element

            /*check for a no return, set default image if so*/
            if(imageSrc.hits.length == 0)
            {
                document.body.style.backgroundImage = "url('./media/default.jpg')"; 
            }else{
                let i = Math.floor(Math.random()*imageSrc.hits.length);
                let imgURL = imageSrc.hits[i].largeImageURL;     
                console.log(imgURL);
                document.body.style.backgroundImage = "url("+imgURL+")";
            }

            /*Calculate duration and update duration*/
            let duration = calcDays(endDate, startDate);
            document.getElementById("duration").innerHTML = "Trip Length: " + duration + " day(s)";
            document.getElementById("itinerary").style.display = "flex";
            document.getElementById("container").style.display = "none";
            //postData('/add', {temp: data.main.temp , date: today, feelings: feelings}) JUST COMMETED
        })
        //Update the UI
        //.then(()=> updateUI()); JUST COMMETED
    }   
}

function calcDays(end, start){
    let days = Math.floor((end - start)/(1000*60*60*24));
    return days;
}

const getCoordinates = async (apiURL)=>{ //can this just be used generically? 
    const res = await fetch(apiURL) //baseURL+zip+apiKey+units
    try{
        const data = await res.json();
        return data;
    } catch(error){
        console.log("There was a problem", error);
    }
}

/*Call Weather API data*/
const getWeather = async (apiURL)=>{ //can this just be used generically? 
    const res = await fetch(apiURL) //baseURL+zip+apiKey+units
    try{
        const data = await res.json();
        return data;
    } catch(error){
        console.log("There was a problem", error);
    }
}

const getImage = async (apiURL)=>{ //can this just be used generically? 
    const res = await fetch(apiURL) //baseURL+zip+apiKey+units
    try{
        const data = await res.json();
        return data;
    } catch(error){
        console.log("There was a problem", error);
    }
}

/*Post the data, combine weather data from API with user data from UI*/
const postData = async (url = '', data = {})=>{
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    try{
        const allData = await response.json();
        console.log(allData + "you made it here");
        return allData;
    } catch(error){
        console.log("There was a problem", error);
    }
}

/*Update the UI with the returned Weather and feeling data*/
const updateUI = async () => {
    const request = await fetch('/all');
    try{
        const pageData = await request.json();
        console.log(pageData + "last debug"); //debug
        //do document updates here
    } catch(error){
        console.log("There was a problem", error);
    }
}

export { generatePage, resetPage, calcDays }
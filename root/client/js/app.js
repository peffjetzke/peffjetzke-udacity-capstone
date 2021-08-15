/*Imports*/
import { calcDays } from './calc'
//import {...} from './update'
import { fieldValidation } from './validation'

let returnData = {};
/*Create new trip button event*/
function resetPage(e){
    event.preventDefault()
    location.reload();
}

//Function for event listener
function generatePage(e){
    event.preventDefault()
    
    let city = document.getElementById("city_form").value;
    let country = document.getElementById("country_form").value;

    let startDate = new Date(document.getElementById("start").value);
    let endDate = new Date(document.getElementById("end").value);

    let formData = {
        city: city,
        country: country,
        start: startDate,
        end: endDate,};

    console.log(formData);
    /*Start with data validation*/
    if(fieldValidation(formData)){
        
        /*Assign variables from UI*/
        let today = new Date();
        let duration = calcDays(endDate, startDate);
        let forecastDays = calcDays(endDate, today);

        console.log("Start: ", startDate);
        console.log("End: ", endDate);
        console.log("Duration: ", duration)
        console.log("Forecast Days: ", forecastDays);

        /*Add duration and forecast days to the form data object*/
        formData["forecastDays"] = forecastDays;
        formData["duration"] = duration;
        console.log("Updated Form Data: ", formData);

        /*POST to server side with data from the form*/
        //returnData = postData('http://localhost:8081/add', formData)
        postData('http://localhost:8081/add', formData)
        .then(async ()=>{
            const returnData = await getData();
            console.log("Get Data: ", returnData)
            updateUI(returnData);
        });
    }else{
        //no else, handled in the function
    }
}

/*Post the data, combine weather data from API with user data from UI*/
const postData = async (url = '', data = {})=>{
    console.log("Sending data to server...")
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    });
    try{
        //const allData = await response.json();
        const allData = await response;
        console.log("All Data Response:", allData);
        return allData;
    } catch(error){
        console.log("There was a problem", error);
    }
}

const getData = async () =>{ 
    console.log("Requesting Data...");
    const request = await fetch('http://localhost:8081/all');
    try {
    const allData = await request.json();
    return allData;
  }
    catch(error) {
      console.log("error", error);
    }
  }

  /*Update UI based on data returned from server*/
  function updateUI(uiData){
    console.log("Updating UI...")

    let city = uiData.city;
    let country = uiData.country;
    let fDays = uiData.fDays;
    let imgURL = uiData.imgsrc;
    let duration = uiData.duration;
    
    //Location Data
    document.getElementById("city").innerHTML = "City: " + city;
    document.getElementById("country").innerHTML = "Country: " + country;

    //Update background
    document.body.style.backgroundImage = imgURL; //"url("+imgURL+")";

    //Forecast Data
    if(fDays<=1){
        let temp = uiData.temp;
        let high = uiData.high;
        let low = uiData.low;
        let desc = uiData.desc;
        let icon = uiData.icon;

        console.log("High: ", high);
        console.log("Low: ", low);
        console.log("Description : ", desc);
        console.log("Current Weather: ", temp);
        document.getElementById("current").innerHTML = "Curent: " + temp + " F";
        document.getElementById("high").innerHTML = "High: " + high + " F";
        document.getElementById("low").innerHTML = "Low: " + low + " F";
        document.getElementById("icon").setAttribute("src", "https://www.weatherbit.io/static/img/icons/" + icon + ".png");
        console.log("https://www.weatherbit.io/static/img/icons/" + icon + ".png");
        document.getElementById("description").innerHTML = desc;

    }else if (fDays>=16) {
        //let temp = uiData.temp;
        let high = uiData.high;
        let low = uiData.low;
        let desc = uiData.desc;
        let icon = uiData.icon;

        document.getElementById("current").remove();
        document.getElementById("high").innerHTML = "High: " + high + " F";
        document.getElementById("low").innerHTML = "Low: " + low + " F";
        document.getElementById("icon").setAttribute("src", "https://www.weatherbit.io/static/img/icons/" + icon + ".png");
        document.getElementById("description").innerHTML = desc;
    }else{
        //let temp = uiData.temp;
        let high = uiData.high;
        let low = uiData.low;
        let desc = uiData.desc;
        let icon = uiData.icon;
        
        document.getElementById("current").remove();
        document.getElementById("high").innerHTML = "High: " + high + " F";
        document.getElementById("low").innerHTML = "Low: " + low + " F";
        document.getElementById("icon").setAttribute("src", "https://www.weatherbit.io/static/img/icons/" + icon + ".png");
        document.getElementById("description").innerHTML = desc;

    //Calculate duration and update duration
    document.getElementById("duration").innerHTML = "Trip Length: " + duration + " day(s)";
    document.getElementById("itinerary").style.display = "flex";
    document.getElementById("container").style.display = "none";

    console.log("UI Update Complete!");
  }
}
/*Update the UI with the returned Weather and feeling data*/
// const updateUI = async () => {
//     const request = await fetch('http://localhost:8080/all');
//     try{
//         const pageData = await request.json();
//         console.log(pageData + "last debug"); //debug
//         //do document updates here
//     } catch(error){
//         console.log("There was a problem", error);
//     }
// }

export { generatePage, resetPage, calcDays }
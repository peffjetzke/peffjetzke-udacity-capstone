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
        console.log("Duration: ", forecastDays);

        /*Add duration and forecast days to the form data object*/
        formData["forecastDays"] = forecastDays;
        formData["duration:"] = duration;
        console.log("Updated Form Data: ", formData);
        // let formData = {
        //     city: city,
        //     country: country,
        //     forecastDays: forecastDays,
        //     duration: duration};

        /*POST to server side with data from the form*/
        //returnData = postData('http://localhost:8081/add', formData)
        postData('http://localhost:8081/add', formData);
        let returnData = getData();
        console.log("Return Data: ", returnData);
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
    //const allData = await request.json();
    const allData = await request;
    console.log("Get Data: ", allData.request);
  }
    catch(error) {
      console.log("error", error);
    }
  }

/*Update the UI with the returned Weather and feeling data*/
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try{
        const pageData = await request.json();
        console.log(pageData + "last debug"); //debug
        //do document updates here
    } catch(error){
        console.log("There was a problem", error);
    }
}

export { generatePage, resetPage, calcDays }
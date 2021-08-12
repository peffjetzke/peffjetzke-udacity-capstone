/*Imports*/
//import { calcDays } from './js/calc'
//import {...} from './js/update'
//import {...} from './js/validation'

/*Create new trip button event*/
function resetPage(e){
    event.preventDefault()
    location.reload();
}
//Function for event listener
function generatePage(e){
    event.preventDefault()
    
    /*Start with data validation*/

    /*Assign variables from UI*/
    let city = document.getElementById("city_form").value;
    let country = document.getElementById("country_form").value;
    /*Date Variables*/
    let startDate = new Date(document.getElementById("start").value);
    let endDate = new Date(document.getElementById("end").value);
    let today = new Date();

    let duration = calcDays(endDate, startDate);
    let forecastDays = calcDays(endDate, today);

    console.log("Start: ", startDate);
    console.log("End: ", endDate);

    /*Collect the form data in an object*/
    let formData = {
        city: city,
        country: country,
        forecastDays: forecastDays,
        duration: duration};

    /*POST to server side with data from the form*/
    postData('http://localhost:8081/add', formData)
    .then(()=>{
        const data = getData();
    }).then((data)=>{
        console.log(data);
    }); //localhost:8081

}

function calcDays(end, start){
    let days = Math.floor((end - start)/(1000*60*60*24));
    return days;
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
    console.log("Response: ", response);
    console.log("Response Body: ", response.body);
    try{
        console.log(data);
        //const allData = await response.json();
        const allData = await response;
        console.log("All Data Response:", allData.body);
        return allData;
    } catch(error){
        console.log("There was a problem", error);
    }
}

const getData = async () =>{ 
    const request = await fetch('http://localhost:8081/all');
    try {
    const allData = await request.json();
    console.log('allData ', allData);
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
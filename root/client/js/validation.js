/*Field Validation*/
function fieldValidation(data){
    if(data.city == "")
    {
        alert("Please Enter a City");
        return false;
    }else if(data.country == "")
    {
        alert("Please Enter a Country");
        return false; 
    }else if(data.start == "Invalid Date")
    {
        alert("Please select a start date."); 
        return false;
    }else if(data.end == "Invalid Date")
    {
        alert("Please select an end date.");
        return false; 
    }else{
        return true;
    }
}

export { fieldValidation }

/*Calculate days betwween start and end date*/
function calcDays(end, start){
    let days = Math.floor((end - start)/(1000*60*60*24));
    return days;
}

export {calcDays}
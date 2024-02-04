function getDataFromRange(){

    let symbol = document.getElementById("symbol_input").value.toUpperCase();
    let date1 = document.getElementById("date_from").value;
    let date2 = document.getElementById("date_to").value;
    
    fetchData(symbol, date1, date2);

}

function getData(){
    let symbol = document.getElementById("symbol_input").value.toUpperCase();
    let cotizacion = document.getElementById("cotizacion_input").value;
    let days = document.getElementById("days_back").value;

    let date = extractDate(subtractDays(days));

    fetchData(symbol, cotizacion, date);
}

function subtractDays(days){
    let newDate = new Date();
    newDate.setDate(newDate.getDate() - (days-1))
    // console.log(newDate.getDay());
    return newDate;
}


//once both data points have been resolved calculates the variance
async function fetchData(symbol, cotizacion, date){
    try {
        const [data] = await Promise.all([
            fetchStockData(symbol, date)
        ]);
        
        const [dateData, close] = data;
        let variance = getVariance(close, cotizacion);
        
        let currentDate = extractDate(new Date());
        
        const markup = `<li>${symbol} cerró a ${close} en el día ${date}; y a ${cotizacion} en el día ${currentDate}. Varianza: ${variance}</li>`;
        document.querySelector('ul').insertAdjacentHTML('beforeend', markup);
        
    } catch (error){
        console.error('Error ', error);
    }
}

//takes the closing values and calculates the % variance rounding at 2 decimals, close2 being the most recent date
function getVariance(close1, close2){
    let variance = ((close2-close1)/close1)*100;
    variance = Math.round(variance * 100) / 100;
    return variance;
}

//extracts a string in format "YYYY-MM-DD" from a Date object
function extractDate(date){
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    
    let dateString = `${year}-${month}-${day}`;
    return dateString;
}

//sends a request to fetch the data of a given company on a specific date
function fetchStockData(symbol, date){
    return fetch(`https://api.stockdata.org/v1/data/eod?symbols=${symbol}&interval=day&date=${date}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer RsizqIGBDYQrCYTv7jICOdPNO27REdBC7IBrLN0e`,
        }
    }).then(res => {
        return res.json();
    })
    .then(data => {
        let a = data.data[0];
        return ([a.date, a.close]);
    })
    .catch((error) => {
        console.error('Unable to fetch data: ', error);
        throw error;
    })
}

function fetchMockData(date){
    return fetch(`./${date}.json`)
    .then((res) => {
        return res.json();
    })
    .then((data) => {
        let a = data.data[0];
        return ([a.date, a.close]);
    })
    .catch((error) => {
        console.error('Unable to fetch data: ', error);
        throw error;
    })
}

function fetchMockDataByRange(dateFrom, dateTo){
    fetch("./response.json")
    .then((res) => {
        return res.json();
    }).then((data) => {
        arr = data.data;
        // console.log(arr);
        // console.log(arr[arr.length - 1]);

        // console.log("date To: ", dateTo);
        // console.log("last Array date: ", arr[arr.length - 1].date);
        // console.log("first Array date: ", arr[0].date);

        const dateToObj = new Date(dateTo);
        // const lastDateObj = new Date(arr[arr.length - 1].date);
        const firstDateObj = new Date(arr[0].date);

        // console.log("Are DateTo and FirstArrayDate they equal? ", dateToObj.getTime() == firstDateObj.getTime());
        // console.log(`DateTo: ${dateToObj}, First array date: ${firstDateObj}`);
        // console.log(`DateTo getTime: ${dateToObj.getTime()}`);



        return arr;

    })
    .catch((error) => 
        console.error('Unable to fetch data: ', error));
}
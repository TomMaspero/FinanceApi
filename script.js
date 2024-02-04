function getDataFromRange(){

    let symbol = document.getElementById("symbol_input").value.toUpperCase();
    let date1 = document.getElementById("date_from").value;
    let date2 = document.getElementById("date_to").value;
    
    fetchData(symbol, date1, date2);

}

function getData(){
    let symbol = document.getElementById("symbol_input").value.toUpperCase();
    let date = document.getElementById("current_date").value;
    let days = document.getElementById("days_back").value;

    let priorDate = extractDate(subtractDays(date, days));
    
    console.log(priorDate, date);

    fetchData(symbol, priorDate, date);
}

function subtractDays(date, days){
    let newDate = new Date(date);
    // console.log(date)
    newDate.setDate(newDate.getDate() - (days-1))
    return newDate;
}

//extracts a string in format "YYYY-MM-DD" from a Date object
function extractDate(date){
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2);
    let day = ('0' + date.getDate()).slice(-2);
    
    let dateString = `${year}-${month}-${day}`;
    return dateString;
}

//once both data points have been resolved calculates the variance
async function fetchData(symbol, date1, date2){
    try {
        const [data1, data2] = await Promise.all([
            fetchStockData(symbol, date1),
            fetchStockData(symbol, date2)
            // fetchMockData(date1),
            // fetchMockData(date2),
        ]);

        const [date1Data, close1] = data1;
        const [date2Data, close2] = data2;
        let variance = getVariance(close1, close2);

        const markup = `<li>${symbol} closed at ${close1} on ${date1} and at ${close2} on ${date2}, variance: ${variance}</li>`;
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
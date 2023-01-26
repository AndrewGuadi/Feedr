//I am using this temp file to create a function that will accept the decided stock and change the color of its font to correlate with
//the days sentiment

let stock = 'MULN'
fetch(`https://stocknewsapi.com/api/v1/stat?&tickers=${stock}&date=today&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
.then(response =>{
    return response.json()
})
.then(data =>{
    let sentiment = data.data
    let key = Object.keys(sentiment)
    let dataKey = Object.keys(sentiment[key[0]])
    console.log(sentiment[key[0]][dataKey[0]].sentiment_score)
})
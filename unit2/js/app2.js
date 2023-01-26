console.log(stockSymbols)
/* I am not sure where the most appropriate place to keep these variables would be as they are used from one function refineSearchQuery
they do need to remain in the global scope if I understand correctly.
*/
let tickerArray= []
let sourceArray = []


const apiKey = 'XLotudsMpedwX5TiVpBoqa4KESYBDUy7SXlQMr0n';
const baseUrl = "https://stocknewsapi.com/api/v1"

/* EXAMPLE URL THAT IS VERIFIED FOR COMPARISON ***DELETE ON COMPLETETION***
https://stocknewsapi.com/api/v1/category?section=general&items=3&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7
*/

const userEndpoints = {
  topMentionStocks : "/top-mention?&date=last30days&items=10&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7",
  popularEvents: "/events?&page=1&items=5&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7",
  topHeadlines: "/trending-headlines?&page=1&items=7&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7",
  generalNews: "/category?section=general&items=20&page=1&sortby=rank&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7"
}

//This function represents the easiest way return successful api calls
const callApiData = function(endpoint){
  return fetch(baseUrl+endpoint)
  .then(response => response.json()
  )
}

window.onload = function(){
   
  //Append the top ten stocks to the page
  callApiData(userEndpoints.topMentionStocks).then(data =>{
    let news = data.data.all.slice(0,10)
    const topStocksDiv = document.getElementById('topStocksList')
    let newHtml = ""
    let counter = 1
    news.map(value =>{
      newHtml += `<h2>${counter}. ${value.ticker}</h2>`
      counter++
    })

    topStocksDiv.innerHTML = newHtml
  })

  //append the general news to the webpage
  callApiData(userEndpoints.generalNews).then(data =>{
    let news = Object.entries(data.data)
    const feedr = document.getElementById('main')
    let newsNews = ''
    news.map(article =>{
      /* working on ALGO below to correctly display a background color correlated to the article sentiment
      style="background-color:${(article[1].sentiment === "Positive") ? 'green' : 'red'}"
      let color = (article[1].sentiment === 'Positive') ? 'green' : (article[1].sentiment === 'Neutral') ? 'white' : 'red' 
      this works but is not able to account for neutral articles. Trinary Operator?
      */
      let color = (article[1].sentiment === 'Positive') ? 'green' : (article[1].sentiment === 'Neutral') ? 'white' : 'red'
      newsNews += `<article class="article ${color}" data-url=${article[1].news_url} data-title="${article[1].title}" data-text="${article[1].text}" data-imageUrl="${article[1].image_url}" onclick=selectArticle()>
                      <section class="featuredImage">
                        <img src="${article[1].image_url}" alt="" />
                      </section>
                      <section class="articleContent">
                        <a href="#"><h3 onmouseover="this.style.color='black'" onmouseout="this.style.color='white'">${article[1].title}</h3></a>
                      </section>
                      <div class="clearfix"></div>
                      </article>`
    })
    console.log(newsNews)
    feedr.innerHTML += newsNews
  })


  //append the top 5 popular events to the page
  callApiData(userEndpoints.popularEvents).then(data =>{
    console.log(data)
    let news = data.data
    const popularEventsList = document.getElementById('popularEventsList')
    let newHTML = ""
    news.map(value =>{
      newHTML += `<h2 class="newsEventLayout" data-eventId=${value.event_id} onclick='searchEventId(event)' >${value.event_name}</h2 >
                    <hr>`
    })

    popularEventsList.innerHTML = newHTML
  })
  for (let i = 1; i<1000; i++){
    console.log("Test Time")
  }
  // document.getElementById('popUp').classList.add('hidden')

  ///Append the headline banner to the page
  callApiData(userEndpoints.topHeadlines).then(data =>{
    let news = data.data
    const headlineBanner = document.getElementById('headlines-banner')
    let newsText = ""
    news.map(value =>{ 
      newsText += `|  ${value.headline}  |`
      })
    document.getElementById('text').innerHTML = newsText
  })

  var text = document.getElementById("text");
  var width = text.offsetWidth;

  // Set the initial offset of the text to the width of the element
  text.style.left = width/2 + "px";

  // Start the animation
  text.style.animation = "scroll 100s linear infinite";
  
}

document.getElementById('popUp').classList.add("hidden")
// Listen for the animation to end
text.addEventListener("animationend", function() {
  // reset the offset
  text.style.left = width + "px";

  // load new data into the text element
  //Make function that returns the <p> div that holds new headlines that have not been displayed yet.
  text.innerHTML = "New headline goes here";

  // Re-start the animation
  text.style.animation = "scroll 100s linear infinite";
});



//function for clicking on an article that displays the clicked on information as a pop-up
const selectArticle = function(){
  let el = event.currentTarget.dataset;
  const backgroundUrl = el.imageurl
  console.log(backgroundUrl)
  document.getElementById('articleTitle').innerHTML = el.title;
  document.getElementById('articleContent').innerHTML = el.text;
  let aUrl = document.getElementById('articleUrl')
  aUrl.innerHTML = 'Go to Article'
  aUrl.setAttribute('href', el.url)
  document.getElementById('popUp').classList.remove('loader', 'hidden')
  document.getElementById('popUp').style.backgroundImage = `url(${backgroundUrl})`
  const deCss = getComputedStyle(document.getElementById("testBackground"))
  console.log(deCss.backgroundImage)
  document.getElementById('headlines-banner').classList.add('hidden', 'loader')
}

//FUNCTION that hides data when the article is closed.
const hide = function(){
  document.getElementById('popUp').classList.add('loader', 'hidden')
  document.getElementById('headlines-banner').classList.remove('hidden', 'loader')
}


//function to check what newsSources are selected
const watchThis = function(){
  
  let checkboxes = document.querySelectorAll("input[type='checkbox']");
  let checkboxValues = {};

  for (let i = 0; i < checkboxes.length; i++) {
      let checkbox = checkboxes[i];
      let id = checkbox.id;
      let value = checkbox.checked;
      checkboxValues[id] = value;
  }
    return checkboxValues
}

const resetNewSources = function(){
  
  let div = document.getElementById("sourceToggleBox");
  let checkboxes = div.getElementsByTagName("input");
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].type == "checkbox") {
      checkboxes[i].checked = false;
    }
  }

}


const searchEventId = function(event){
  event.preventDefault()
  const eventData = event.currentTarget.dataset
  const eventid = eventData.eventid
  const eventEndpoint = `/events?&eventid=${eventid}&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`;
  
  fetch(baseUrl+eventEndpoint)
  .then(response =>{
    return response.json()
  })
  .then(data =>{
    let news = data.data
    let newsNews = ''
    news.map(article =>{
      let color = (article.sentiment === 'Positive') ? 'green' : (article.sentiment === 'Neutral') ? 'white' : 'red'
      newsNews += `<article class="article ${color}"  data-url=${article.news_url} data-title="${article.title}" data-text="${article.text}" data-imageUrl="${article.image_url}" onclick=selectArticle()>
                    <section class="featuredImage">
                      <img src="${article.image_url}" alt="" />
                    </section>
                    <section class="articleContent">
                      <a href="#"><h3 onmouseover="this.style.color='black'" onmouseout="this.style.color='white'">${article.title}</h3></a>
                    </section>
                    <div class="clearfix"></div>
                  </article>`
  })
  console.log(newsNews)
  const feedr = document.getElementById('main')
  feedr.innerHTML = newsNews

})}



//function to extract the necessary url to fetch for proper json data
const refineSearchQuery = function(sourceArray, tickerArray){
  // console.log(sourceArray.join(), tickerArray.join())
  if (sourceArray.length && tickerArray.length){
    console.log(1)
    console.log(baseUrl+`?tickers-include=${tickerArray.join()}&source=${sourceArray.join()}&items=100&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
    return fetch(baseUrl+`?tickers-include=${tickerArray.join()}&items=100&source=${sourceArray.join()}&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
  } else if(sourceArray.length && !tickerArray.length){
    console.log(2)
    return fetch(baseUrl+`?items=50&source=${sourceArray.join()}&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
  } else if(!sourceArray.length && tickerArray.length){
    console.log(3)
    console.log(baseUrl+`?tickers-include=${tickerArray.join()}&items=100&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
    return fetch(baseUrl+`?tickers-include=${tickerArray.join()}&items=100&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
  } else if(!sourceArray.length && !tickerArray.length){
    console.log(4)
    return fetch(baseUrl+`/category?section=general&items=100&page=1&token=q6svykcnttfreirncdnffgcnd2jdb5jnjjifgef7`)
  }
}

//Event listener that changes the data displayed in the news section using the users search queries
document.getElementById('search-filters').addEventListener("submit", function(e){
  e.preventDefault();
  sourceArray = []
  tickerArray = []
  //if the return on the object has a value for a key:pair we want to extract that value
  for (const [key, value] of Object.entries(watchThis())) {
    if (value){
      sourceArray.push(key)
    }
  }
  const feedr = document.getElementById('main')
  const userQuery = document.getElementById('userQuery').value
  if (userQuery){
    tickerArray = userQuery.split(' ')
  }
  document.getElementById('userQuery').value = ''
  refineSearchQuery(sourceArray, tickerArray).then(response =>{
    return response.json()
  })
  .then(data =>{
    let news = data.data
    let newsNews = ""
    news.map(article =>{
      let color = (article.sentiment === 'Positive') ? 'green' : (article.sentiment === 'Neutral') ? 'white' : 'red'
      newsNews += `<article class="article ${color}"  data-url=${article.news_url} data-title="${article.title}" data-text="${article.text}" data-imageUrl="${article.image_url}" onclick=selectArticle()>
                    <section class="featuredImage">
                      <img src="${article.image_url}" alt="" />
                    </section>
                    <section class="articleContent">
                      <a href="#"><h3 onmouseover="this.style.color='black'" onmouseout="this.style.color='white'">${article.title}</h3></a>
                    </section>
                    <div class="clearfix"></div>
                  </article>`
    })
    //console.log(newsNews)
    feedr.innerHTML = newsNews 
    if(feedr.innerHTML === ""){
      feedr.innerHTML = `<h1 style='color:white;'>Please Retry Search with Appropriate Stock Symbol.</h1>`
    }
  })
})

//event listener to load default "general news" data when clicked
document.getElementById('logo').addEventListener('click', function(){
  resetNewSources();
  callApiData(userEndpoints.generalNews).then(data =>{
    let news = Object.entries(data.data)
    const feedr = document.getElementById('main')
    let newsNews = ''
    news.map(article =>{
      let color = (article[1].sentiment === 'Positive') ? 'green' : (article[1].sentiment === 'Neutral') ? 'white' : 'red'
      newsNews += `<article class="article ${color}" data-url=${article[1].news_url} data-title="${article[1].title}" data-text="${article[1].text}" onclick=selectArticle()>
                      <section class="featuredImage">
                        <img src="${article[1].image_url}" alt="" />
                      </section>
                      <section class="articleContent">
                          <a href="#"><h3 onmouseover="this.style.color='black'" onmouseout="this.style.color='white'">${article[1].title}</h3></a>
                      </section>
                      <div class="clearfix"></div>
                    </article>`
    })

    console.log(newsNews)
    feedr.innerHTML = newsNews
  })
})




/* EXAMPLE OF EFFECTIVELY CALLING addEventListener to DOM with watchThis function being called
document.getElementById('popular-events').addEventListener('click', watchThis)
*/

/* EXPERIMENTAL FOR SELECTING VALUE FROM DATA STORED AT TOGGLES
const nytToggle = document.getElementById('newYorkTimes')

nytToggle.addEventListener('change', function(){
  console.log(nytToggle.checked)
})

*/
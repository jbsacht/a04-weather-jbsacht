let render = document.getElementById('main');

render.style.textAlign = "center"
document.body.style.background = "#eeeeee";
document.body.style.display = "flex"
document.body.style.justifyContent = "center"


let canvas = document.createElement('div');
canvas.id = "canvas";

const today = new Date();
const dayOfWeek = today.toLocaleDateString("en-US", { weekday: 'long' });
const dayOfMonth = today.getDate();
const month = today.toLocaleDateString("en-US", { month: 'long' });
const year = today.getFullYear();

const formattedDate = `${dayOfWeek}, ${dayOfMonth} ${month}, ${year}`;

const h1 = document.createElement("h1");
h1.textContent = formattedDate;

canvas.append(h1);

// Define the API URL
let apiUrl = 'https://api.weather.gov/points/35.911089,-79.047989'
let forecast = "";
// Make a GET request
await fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    forecast = data.properties.forecast;
    fetch(forecast)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data)
    let today = data.properties.periods[1];
    canvas.append("Today in Chapel Hill: " + today.detailedForecast)
    canvas.append(document.createElement("br"))
    let dayHolder = document.createElement("div")
    dayHolder.id = "dayHolder"
    for(let i=0; i<data.properties.periods.length; i += 2) {
        let day = document.createElement('div')
        day.style.position = 'absolute'
        day.style.display = "flex"
        day.style.top = "100px"
        day.style.flexDirection = "column"
        day.style.left = 150 + i * 50 + "px";
        day.style.width = "90px"
        if(i==0) {
            day.append("Today");
        }
        else {day.append(data.properties.periods[i].name) }
        day.append(document.createElement("br"))
        day.append(data.properties.periods[i+1].temperature)
        day.append("°/")
        day.append(data.properties.periods[i].temperature)
        day.append("°")

        fetch(data.properties.periods[i].icon).then(responde => {
            if(!responde.ok) {throw new Error("Bruh the icon broke")}
            return responde;
        }).then(data => {
            let img = document.createElement('img');
            img.src = data.url
            day.append(img);
        });
        dayHolder.append(day)
    }
    canvas.append(dayHolder)
  })
  .catch(error => {
    console.error('Error:', error);
  });
  })
  .catch(error => {
    console.error('Error:', error);
  });


//canvas.append(forecast)

let picURL = "https://api.nasa.gov/planetary/earth/assets?lon=-79.047989&lat=35.911089&date=2018-04-10&&dim=0.25&api_key=jH7y7Z4S0vD7mYB0V2ELJFHT3gpbG9HsIAF3dKg2"
await fetch(picURL)
  .then(response => {
    if (!response.ok) {
      throw new Error('NASA pic is a nogo');
    }
    return response.json();
  }).then(data => {
    fetch(data.url).then(responde => {
        if(!responde.ok) {throw new Error("Bruh the image broke")}
        return responde;
    }).then(data => {
        let img = document.createElement('img');
        img.id = "satPhoto"
        img.src = data.url
        canvas.append(img);
    });
  }
  )
render.append(canvas);
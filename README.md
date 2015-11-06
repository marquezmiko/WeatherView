# WeatherView
Original idea to be continued later:<br>
*get current weather conditions and display instagrams and tweets with related hashtags*
*partly inspired by http://youarelistening.to/newyork*

Use OpenWeather API with api key provided

First attempt to use Node.js and MongoDB in a functioning SPA!

## Application
* Can specify units
* Add a city,country tuple to the database, then click on city name to show current conditions
* Data is retrieved via AJAX calls, JSON is returned
* Decided to not store the json data in a db, as they change and update constantly
* If user wishes to merely query api and retrieve json, can use form at the bottom


### MongoDB
* Data stored in 'data' directory
* Collection used is 'cityList'
* Each entry has city, country, and a unique _id (auto-generated by MongoDB)

### Node.JS
* I used the EXPRESS package and accompanying generator
* All files located under the 'myapp' directory, sub-directories are same as how the generator set them
* Went ahead and started learning how .jade files work
* Stuck with jQuery for dynamic elements and manipulating the DOM

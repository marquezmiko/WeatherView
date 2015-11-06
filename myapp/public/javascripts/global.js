// CityList data array for filling in info box
var cityListData = [];
// API Key provided (thanks Matt)
var apiKey = '355e806e0c6b3aa9c5c24c36144d073b';
// Units for query responses
var units = 'kelvin';

// Prep the DOM
$(document).ready(function() {

    // Initial MongoDB load
    populateTable();

    // Unit Selection
    $('#btnUnit').on('click', unitSet);

    // City Weather click
    $('#cityList table tbody').on('click', 'td a.linkShowCity', showCityInfo);

    // New City button click
    $('#btnAddCity').on('click', addCity);

    // Delete City click
    $('#cityList table tbody').on('click', 'td a.linkDeleteCity', deleteCity);

    //Query API plainly
    $('#btnQuery').on('click', queryAPI);

});

//===============Custom functions===============

//New units
function unitSet(event){
    event.preventDefault();

    // Retrieve username from link rel attribute
    var newUnits = $('#unitSelect fieldset input#inputUnits').val();
    
    units = newUnits;
    // Clear form
    $('#unitSelect fieldset input').val('');
    $('#temperatureUnit').text(units);
}

// Fill table section with data
function populateTable() {

    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/cities/cityList',
        function( data ) {
        //Set data to current variable
        cityListData = data;

        // For each item in our JSON ,add to table
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkShowCity" rel="' + this.city + '">' + this.city + '</a></td>';
            tableContent += '<td>' + this.country + '</td>';
            tableContent += '<td><a href="#" class="linkDeleteCity" rel="' + this._id + '">delete city</a></td>';
            tableContent += '</tr>';
        });

        // Inject all current MongoDB data into HTML
        $('#cityList table tbody').html(tableContent);

        // Make sure units are updated
        $('#temperatureUnit').text(units);
    });
};

// Show User Info
function showCityInfo(event) {
    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisCityName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = cityListData.map(function(arrayItem) { return arrayItem.city; }).indexOf(thisCityName);

    // Get our City Object
    var thisCityObject = cityListData[arrayPosition];
    var thisCountryName = thisCityObject.country;
    
    //Get JSON from api, using parameters specified
    $.getJSON(
            "http://api.openweathermap.org/data/2.5/weather?q="
            +thisCityName
            +","
            +thisCountryName
            +"&appid="
            +apiKey
            +"&units="
            +units,
            function(resultData) {
                //Put data into city weather info section
                $('#cityName').text(resultData.name);
                $('#latitude').text(resultData.coord.lat);
                $('#longitude').text(resultData.coord.lon);
                $('#currentCondition').text(resultData.main.temp);
                $('#highTemp').text(resultData.main.temp_max);
                $('#lowTemp').text(resultData.main.temp_min);
            }
    );
    
};

// Add User
function addCity(event) {
    event.preventDefault();

    // Check for missing variables
    var missingVarCount = 0;
    $('#addCity input').each(function(index, val) {
        if($(this).val() === '') { missingVarCount++; }
    });

    // Check that fields are filled
    if(missingVarCount === 0) {

        //New city variable to put into MongoDB
        var newCity = {
            'city': $('#addCity fieldset input#inputCityName').val(),
            'country': $('#addCity fieldset input#inputCountryName').val()
        }

        // POST for new city
        $.ajax({
            type: 'POST',
            data: newCity,
            url: '/cities/addCity',
            dataType: 'JSON'
        }).done(function( response ) {

            // Success
            if (response.msg === '') {
                
                // Clear form
                $('#addCity fieldset input').val('');
                // Update the table on the page
                populateTable();
            }
            else {
                alert('Error: ' + response.msg);
            }
        });
        
    }
    else {
        // Not all form vars filled
        alert('Fill in all fields');
        return false;
    }
};


// Delete City from MongoDB
function deleteCity(event) {

    event.preventDefault();

    // Get User confirmation
    var confirmation = confirm('Delete this City?');

    if (confirmation === true) {

        //DELETE from database, using passed-in _id
        $.ajax({
            type: 'DELETE',
            url: '/cities/deleteCity/' + $(this).attr('rel')
        }).done(function( response ) {

            // Success
            if (response.msg === '') {
                alert('successful deletion');
            }
            else {
                alert('Error: ' + response.msg);
            }
            // Update the table on the page
            populateTable();
        });

    }
    else {
        //No confirmation
        return false;
    }

};

//'Plain' query of API, not using MongoDB
function queryAPI(event) {
    event.preventDefault();

    //3 possible variables
    var varCount = 3;
    $('#queryAPI input').each(function(index, val) {
        if($(this).val() === '') { varCount--; }
    });

    // 2 Variables = City and Country at least
    if(varCount >= 2) {

        //Query API with City and Country
        var city = $('#queryAPI fieldset input#queryCity').val();
        var country = $('#queryAPI fieldset input#queryCountry').val();
        
        $.getJSON(
            "http://api.openweathermap.org/data/2.5/weather?q="
            +city
            +","
            +country
            +"&appid="
            +apiKey
            +"&units="
            +units,
            function(resultData) {
                alert(JSON.stringify(resultData));
            });
    }

    //Only zip provided
    else if(varCount === 1){

        //Query API with Zip code
        var zip = $('#queryAPI fieldset input#queryZip').val();

        $.getJSON(
            "http://api.openweathermap.org/data/2.5/weather?zip="
            +zip
            +"&appid="
            +apiKey
            +"&units="
            +units,
            function(resultData) {
                alert(JSON.stringify(resultData));
            });
    }
    else {
        // Need more info
        alert('Fill in either a city and country, or a zip code(US)');
        return false;
    }
    // Clear form
    $('#queryAPI fieldset input').val('');
};


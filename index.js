'use strict';

//This funtion renders the results and diplays them in the DOM
function displayResults(responseJson) {
    console.log('displayResults ran');
    //When data is ready - hides progress indicator
    $(responseJson).ready(function () {
        $('.loading').addClass('hidden')
    })
    console.log(responseJson)
    console.log(responseJson.length)
    console.log(responseJson[0].owner.login)
    //Finds and displays username
    let user = responseJson[0].owner.login
    let userinfo = `
        <h4>User: <span class="user">${user}</span></h4>
        <h4><span class="user">Repos: ${responseJson.length}</span></h4>
        <ul class="results-list"></ul>
    `
    $('.js-results').append(userinfo)
    //loop through results and make a list of repos, including link and description
    for (let i = 0; i < responseJson.length; i++) {
        $('.js-results').append(`
        <div class="result-item"><li><h4>${responseJson[i].name}</h4>
        <a href="${responseJson[i].html_url}">${responseJson[i].html_url}</a>
        <p>${responseJson[i].description}</p>
        </li></div>
        `)
    }
    //removes hidden class to display results
    $('.js-results').removeClass('hidden')

}

//Fetches data from API, converts and passes data to be displayed in DOM
function getRepos(username) {
    console.log('getRepos ran');
    //takes username parameter and adds to url
    const url = `https://api.github.com/users/${username}/repos`
    console.log(url);
    //Asynchronous request to GitHub API
    fetch(url)
    //if repsonse is good, returns results in JSON format
        .then(response => {
            if (response.ok) {
                return response.json();
            }
    //if reponse is not ok,then throw an error
            throw new Error(response.statusText);
        })
    //if reponse is ok, then we pass the JSON results into displayResults to be rendered in DOM
        .then(responseJson => displayResults(responseJson))
    //if reponse is not ok, then the error we threw will be passed as a parameter in the displayError function and rendered in DOM
        .catch(err => {
            displayError(err.message);
        });
}

//Takes thrown error as parameter and displays in DOM
function displayError(error) {
    console.log('displayError ran');
    $('.js-results').html(`<h3 class="error">Something went wrong: ${error}</h3>`)
    $('.loading').addClass('hidden');
    $('.js-results').removeClass('hidden')
}
//This function uses random to select the text of the Search Button
function getSearchPhrase() {
    return (['Search', 'Find','Look up','Go','Check','Push this button','Don\'t push this button'])[Math.floor(Math.random() * 7)];
}

//Event listener for submit event
function watchForm() {
    //Listens for submit event
    $('#js-form').submit(event => {
        //override default behavior
        event.preventDefault();
        console.log('watchForm ran');
        //determine the text of the button
        let searchPhrase = getSearchPhrase()
        console.log(searchPhrase)
        //change the text of the search button
        $('#find-btn').html(searchPhrase)
        //clears any prior data from results section
        $('.js-results').empty().addClass('hidden')
        //store username 
        const username = $('.js-username').val();
        console.log(username);
        //This utilizes setTimeout function to test progress indicator animation
        $('.loading').removeClass('hidden');
        setTimeout(function () {
            //pass username to API call 
            getRepos(username);
        }, 1000)
    });
}

$(watchForm);

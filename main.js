var apiKey = 'a0be57be16a4e12caf8bc464e1f02b13';

var currentRating = 0;
var currentGenre = ['Any'];

var allGenre = ['Any', 'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery', 'Romance', 'Science Fiction', 'TV Movie', 'Thriller', 'War', 'Western'];
var genreId = ['', '28', '12', '16', '35', '80', '99', '18', '10751', '14', '36', '27', '10402', '9648', '10749', '878', '10770', '53', '10752', '37']
var maxRating = 9;

var loadingText = ['Dividing by zero...', 'Turning on the TV...', 'Distracted by cat gifs', 'Loading over 9000 variables...', 'Just a loading screen...', "Help, I'm trapped in a loader!", 'Spinning the hamster...', 'Pushing pixels...', 'Grabbing extra minions', 'Getting the perfect movie...', 'Getting popcorn...', 'Are we there yet?', 'Where is the remote...'];

generateMainPageHTML();

function generateMainPageHTML() {

    let html = '<div class="options"><div class="genre"><h2>Genre</h2><div class="genreButtons">';

    for(const g of allGenre) {
        
        html += '<button '
        if(currentGenre.includes(g)) {
            html += 'class="selected genreButton" ';
        } else {
            html += 'class="genreButton" ';
        }
        html +='id="genre' + g + '">' + g + '</button>';

    }

    html += '</div></div><div class="rating"><h2>Min. TMDb Rating</h2><div class="ratingButtons">';

    for(let i = 0; i <= maxRating; ++i) {
        
        html += '<button '
        if(i === currentRating) {
            html += 'class="selected" ';
        }
        html +='id="rating' + i + '">' + i + '</button>';

    }

    html += '</div></div></div><button id="pickButton">Pick a movie!</button>';

    document.getElementsByClassName('content')[0].innerHTML = html;

    //ADD EVENTS TO EVERY BOTTON
    document.getElementById('pickButton').addEventListener('click', pickMovieClicked);

    //CLICK TO ALL GENRE
    for(const g of allGenre) {
        document.getElementById('genre' + g).addEventListener('click', () => changeGenre(g));
    }

    for(let i = 0; i <= maxRating; ++i) {
        document.getElementById('rating' + i).addEventListener('click', () => changeRating(i));
    }   

}


function changeGenre(genre) {

    if(genre !== 'Any') {

        if(currentGenre.includes('Any')) {
            currentGenre = [genre];
        } else if (currentGenre.includes(genre)) {
            currentGenre.splice(currentGenre.indexOf(genre),1);
            if(currentGenre.length <= 0) {
                currentGenre = ['Any'];
            } 
        } else {
            currentGenre.push(genre);
        }

    } else {
        currentGenre = ['Any'];
    }

    generateMainPageHTML();

}

function changeRating(rating) {

    document.getElementById('rating' + currentRating).className = '';
    currentRating = rating;
    document.getElementById('rating' + currentRating).className = 'selected';

}

function pickMovieClicked() {

    generateLoadingPageHTML();

    setTimeout(function() {
        getMovie();
    }, 200);
    
}

function getMovie() {

    try{

        let randomGenre = currentGenre[Math.floor(Math.random() * currentGenre.length)];

        let url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey +
                '&with_genres=' + genreId[allGenre.indexOf(randomGenre)] +
                '&primary_release_date.gte=1900-01-01' +
                '&vote_average.gte=' + currentRating +
                '&&vote_count.gte=10';

        var xmlHttp = new XMLHttpRequest();

        try {
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);

            if(JSON.parse(xmlHttp.responseText).total_pages < 0) {
                throw "[ERROR] Cant get pages...";
            }

        } catch {
            generateErrorPageHTML();
            throw "[ERROR] Cant reach server...";
        }
        
        let page = Math.floor(Math.random() * JSON.parse(xmlHttp.responseText).total_pages) + 1;

        url = 'https://api.themoviedb.org/3/discover/movie?api_key=' + apiKey +
                '&with_genres=' + genreId[allGenre.indexOf(randomGenre)] +
                '&primary_release_date.gte=1900-01-01' +
                '&vote_average.gte=' + currentRating + 
                '&&vote_count.gte=10' + 
                '&page=' + page;

        try {
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);

            if(!JSON.parse(xmlHttp.responseText).results) {
                throw "[ERROR] Cant get results...";
            }
            
        } catch {
            generateErrorPageHTML();
            throw "[ERROR] Cant get the results...";
        }

        let films = JSON.parse(xmlHttp.responseText).results;

        let filmID;
        if(films.length > 0) {
            filmID = films[Math.floor(Math.random() * films.length)].id;
        } else {
            filmID = films.id;
        }

        url = 'https://api.themoviedb.org/3/movie/' + filmID + '?api_key=' + apiKey;

        try {
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
        } catch {
            generateErrorPageHTML();
            throw "[ERROR] Cant get the film...";
        }
        
        let movie = JSON.parse(xmlHttp.responseText);

        url = 'https://image.tmdb.org/t/p/original/' + movie.poster_path;

        try {
            xmlHttp.open("GET", url, false);
            xmlHttp.send(null);
        } catch {
            //DO NOTHING
        }

        generateMoviePageHTML(movie);

    } catch {
        generateErrorPageHTML();
    }
    

}


function generateLoadingPageHTML() {

    let html = '<div class="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div><h2 class="popcorn">' + loadingText[Math.floor(Math.random()*loadingText.length)] + '</h2>';
    document.getElementsByClassName('content')[0].innerHTML = html;

}

function generateMoviePageHTML(movie) {

    let spokeLanguage = []
    for(const s of movie.spoken_languages) {
        spokeLanguage.push(s.name);
    }

    let html = '<div class="movie"><div><div class="moviePrim"><div class="posterDiv">';

    if(movie.poster_path && movie.poster_path !== '') { 
        let poster = 'https://image.tmdb.org/t/p/original/' + movie.poster_path;
        html += '<img class="poster" src="' + poster + '"/>';
    } else {
        html += '<img class="poster" src="./imgs/no_poster.png"/>';
    }

    if(movie.vote_average && movie.vote_average !== 0) {
        
        //DIFFERENT SCORES
        // 0 / 2.5 - red
        // 2.5 / 7.5 - yellow
        // 7.5 / 10 - green
        if(movie.vote_average < 4) {
            html += '<p class="score red">' + movie.vote_average +'</p>';
        } else if (movie.vote_average < 7) {
            html += '<p class="score yellow">' + movie.vote_average +'</p>';   
        } else {
            html += '<p class="score green">' + movie.vote_average +'</p>';
        }

    } else {
        html += '<p class="score red">N</p>';
    }

    html += '</div><div class="movieInfo">';

    if(movie.title && movie.title !== '') {
        html += '<h2>' + movie.title +'</h2>'; 
    } else {
        html += '<h2>Invalid Title</h2>';
    }
 
    if(movie.genres && movie.genres.length > 0) {
        let genreList = [];
        for(const g of movie.genres) {
            genreList.push(g.name);
        }

        html += '<div><p><strong>Genre</strong></p><p class="inner"> ' + genreList.join(", ") +'</p></div>';
    }

    if(movie.release_date && movie.release_date.length != '') {
        html += '<div><p><strong>Release</strong></p><p class="inner"> ' + movie.release_date.split("-")[0] +'</p></div>';
    }

    if(movie.production_companies && movie.production_companies.length > 0 && movie.production_companies[0].name) {
        html += '<div><p><strong>Production</strong></p><p class="inner"> ' + movie.production_companies[0].name +'</p></div>';
    }

    if(spokeLanguage && spokeLanguage.length > 0) {
        html += '<div><p><strong>Language</strong></p><p class="inner"> ' + spokeLanguage.join(", ") +'</p></div>';
    }

    html += '</div></div>';

    if(movie.overview && movie.overview !== '') {
        html += '<p class="overview"><strong>Overview</strong> ' + (movie.overview.length > 320 ?  movie.overview.substring(0,320)+'...' : movie.overview) +'</p>';
    }
            
    html += '</div><div class="movieSec">' + 
                '<button id="tryAgain">Another one!</button>' +
                '<button id="goback">Back</button>' +
                '</div>' +
                '</div>';

    document.getElementsByClassName('content')[0].innerHTML = html;

    document.getElementById('goback').addEventListener('click', goBack);
    document.getElementById('tryAgain').addEventListener('click', tryAgain);

}

function tryAgain() {
    pickMovieClicked();
}

function goBack() {
    generateMainPageHTML();
}

function generateErrorPageHTML() {

    let html = "<div class='error'><img src='./imgs/error_clap.png'>" +
                "<h2>Didn't find any movie...</h2>" +
                '<button id="tryAgain">Try again!</button>' +
                '<button id="goback">Back</button></div>';
    document.getElementsByClassName('content')[0].innerHTML = html;

    document.getElementById('goback').addEventListener('click', goBack);
    document.getElementById('tryAgain').addEventListener('click', tryAgain);

}

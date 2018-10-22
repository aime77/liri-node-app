require("dotenv").config();

const keys = require('./keys');
const request = require('request');
const inquirer = require('inquirer');
const moment = require('moment');
const Spotify = require('node-spotify-api');
const chalk = require('chalk');
const fs = require('fs');

const spotify = new Spotify(keys.spotify);

let options = {
    "1. Find about your favorite bands' concerts": {
        type: "input",
        message: "Please enter an artist?",
        name: "artistName",
        default: "undefined"
    },
    "2. Get spotify info about songs you like": {
        type: "input",
        message: "Enter song: ",
        name: "songName",
        default: "The Ace"
    },
    "3. Get info about any movie": {
        type: "input",
        message: "Please enter the movie's name: ",
        name: "movieName",
        default: "Mr. Nobody"
    },
    "4. Get demo":{},

    "5. Exit":{},

}

function continueQuery() {
    inquirer.prompt(
        {
            message: 'Would you like back to the main menu?',
            name: 'endQuery',
            type: 'confirm',
        }).then(continueQ => {
            if (continueQ.endQuery) start();
        });
}

function start() {
console.log(`
======================
${chalk.magenta(`MAIN MENU`)}
======================`);
    inquirer.prompt({
        type: 'list',
        name: 'option',
        message: 'Please select an option: ',
        choices: Object.keys(options)
    }).then(choice => {
        
        if(choice.option==="4. Get demo") doWhatItSays();
        else if(choice.option==="5. Exit") return false;
        else{
        inquirer.prompt(options[choice.option]).then(answers => {
            switch (choice.option) {

                case "1. Find about your favorite bands' concerts":
                    concertThis(answers['artistName']);
                    break;

                case "2. Get spotify info about songs you like":
                    spotifyThisSong(answers['songName']);
                    break;

                case "3. Get info about any movie":
                    movieThis(answers['movieName']);
                    break;

                default: continueQuery();
            }
        
        });
    }
    })
}

function concertThis(answers) {
    var url = `https://rest.bandsintown.com/artists/${answers}/events?app_id=b2b1d13e2f579627ed525e0f00cf2713`;

    request(url, (err, res, body) => {
        console.log(body);
        if (!err && res.statusCode === 200) {
            var obj = JSON.parse(body);
            if (obj === undefined || obj.error) {
                console.log("Try a different artist.");
                //handle user mispelling name
                start();//Cam eyebrown raise
            }
            for (var i = 0; i < obj.length; i++) {
                var newTime = obj[i].datetime;
                newTime = moment(newTime).format("MM/DD/YYYY");
                console.log(`
==================================================
${chalk.magenta.bold(`${obj[i].lineup} event number ${i}`)}
==================================================
* Name of venue: ${chalk.bold.blue(obj[i].venue.name)}
* Location of venue: ${chalk.bold.blue(obj[i].venue.country)}, ${chalk.bold.blue(obj[i].venue.city)}
* Date of event: ${chalk.bold.blue(newTime)}\n`);
            }
        }
        continueQuery();
    });
}


function spotifyThisSong(answers) {
        if(answers===" "){
            doWhatItSays(song[1]);
        }
    spotify.search({ type: 'track', query: answers, limit: 20 }, (err, body) => {
        if (err) throw err;
        console.log(`
=========================================================
${chalk.magenta.bold(`Info regarding the song ${body.tracks.items[0].name}`)}
=========================================================
* Artist: ${chalk.bold.blue(body.tracks.items[0].artists[0].name)}
* Name of song: ${chalk.bold.blue(body.tracks.items[0].name)}
* To play the song click on the following link: ${chalk.magenta.underline(body.tracks.items[0].preview_url)}
* The song's album is called: ${chalk.bold.blue(body.tracks.items[0].album.name)}\n`);
        continueQuery();
    });
}


function movieThis(answers) {
    var queryURL = `http://www.omdbapi.com/?t=${answers}&y=&plot=short&tomatoes=true&apikey=trilogy`;
    request(queryURL, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            json = JSON.parse(body);
            console.log(`
============================================
${chalk.magenta.bold(`Info about ${json.Title}`)}
============================================
* Year movie came out is: ${chalk.bold.blue(json.Year)}
* IMDB movie rating: ${chalk.bold.blue(json.imdbRating)} 
* Rotten Tomatoes rating: ${chalk.bold.blue(json.tomatoRating)}
* Country of production: ${chalk.bold.blue(json.Country)}
* Country of production: ${chalk.bold.blue(json.Language)}
* Movie plot: ${chalk.bold.blue(json.Plot)}
* Movie Actors: ${chalk.bold.blue(json.Actors)}\n`);
        }
        continueQuery();
    });
}

function doWhatItSays() {
    fs.readFile("./random.txt", "utf8", (err, body) => {
        if (err) throw err;
        var song=body.split("\n");
        spotifyThisSong(song[0]);
    });
}

function logText(responses) {
    fs.appendFile("log.txt", responses, (err) => {
        if (err) throw err;
    });
}

start();
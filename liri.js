require("dotenv").config();

const inquirer=require('inquirer');
const moment=require('moment');

console.log(process.env.bandsintown_key);
console.log(process.env.omdb_key);

var spotify= new spotify(MediaKeySession.spotify);

inquirer.prompt({
input:'list',
name:'choice',
message:'Please select an option?',
choices:['concert-this','spotify-this-song','movie-this','do-what-it-says']


}).then(function(liri){


switch(true){

    case liri.choice==='concert-this':
    concertThis();
    break;

    case liri.choice==='spotify-this-song':
    spotifyThisSong();
    break;

    case liri.choice==='movie-this':
    movieThis();
    break;

    case liri.choice==='do-what-it-says':
    doWhatItSays();
    break;

    default:


}
    function concertThis(){

    }
    function spotifyThisSong(){}

    function movieThis(){

    }
    function doWhatItSays(){

    }

});
// Require our dependencies
var express = require('express');
var exphbs = require('express-handlebars');
var http = require('http');
var mongoose = require('mongoose');
var Twitter = require('twitter');
var routes = require('./routes');
var config = require('./config');
var Tweet = require('./models/Tweet');

// Create an express instance and set a port 
var app = express();
var port = process.env.PORT || 3000;



// Set handlebars as the templating engine
app.engine('handlebars', exphbs({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Disable etag headers on responses
app.disable('etag');

// Connect to our mongo database
mongoose.connect('mongodb://localhost/react-tweets');

// Create a new twitter api instance
var twitter_api = new Twitter(config.twitter);

// Index Route
app.get('/', routes.index);

// Page Route
app.get('/page/:page/:current', routes.page);

// Set /public as our static content dir
app.use("/", express.static(__dirname + "/public/"));

// setup the server
var server = http.createServer(app).listen(port, function() {
  console.log('Express server listening on port ' + port);
});


//Empty the table and get the past 7 days tweets.
initializeDB();


//Get future #tapingo tweets with twitter stream API 
// Set a stream listener for tweets matching tracking keywords
twitter_api.stream('statuses/filter',{ track: '#tapingo'}, function(stream){

	//listen for new tweet
  	stream.on('data', function(data) {
    
    if (data['user'] !== undefined) {

      var tweet = constructNewTweet(data);

		// Create a new model instance with our object
		var db_tweet = new Tweet(tweet);
		db_tweet.save(function(err){
			if(!err){
				//console.log(db_tweet);
				console.log('New Tweet received and saved');
			}
		});
    }

  });
});

//Function to initialize the DB and get the past 7 days tweets.
function initializeDB(){
	Tweet.collection.remove();

	var params = {
		q: '#tapingo',
		count: 100
	};
	twitter_api.get('search/tweets', params, function(error, tweets, response) {
	   //console.log(tweets);
	   statuses = tweets['statuses'];

	   tweets_to_be_saved = [];

	   if(statuses !== undefined){
		   statuses.forEach(function(data){

			   	var tweet = constructNewTweet(data);
				tweets_to_be_saved.push(tweet);
				var db_tweet = new Tweet(tweet);
				db_tweet.save(function(err){
					if(!err){
						//console.log(db_tweet);
					}
				});
		   });
		}

	});

}

//Function to construct new tweet for given data from twitter api
function constructNewTweet(data){
	// Construct a new tweet object
	if(data['user'] !== undefined){
		var dt = data['created_at'];
		var splitted_dt = dt.toString().split(" ");
		const month_ss = splitted_dt[1];
		const date_ss = splitted_dt[2];

		var tweet = {
		twid: data['id_str'],
		author: data['user']['name'],
		avatar: data['user']['profile_image_url'],
		body: data['text'],
		date: data['created_at'],
		month_s: month_ss,
		date_s: date_ss,
		screenname: data['user']['screen_name'],

		};
	}
	return tweet;
}

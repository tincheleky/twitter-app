var mongoose = require('mongoose');

//Schema for model Tweet
var schema = new mongoose.Schema({
  tweet_id   : String,
  author     : String,
  avatar     : String,
  body       : String,
  date       : Date,
  month_s    : String,
  date_s     : String,
  screenname : String
});


// Function to get Tweet data based on page number.
schema.statics.getTweets = function(page, current, callback) {

  var tweets = [];
  const max_items_per_page = 20;

  // Tweet.find({},'tweet_id author avatar body date screenname')
  // .skip(page * 20)
  // .limit(20)
  // .sort({date: 'desc'})
  // .exec(function(err, data){}

  // Query the db, using skip and limit to achieve page chunks
  Tweet.find({},'tweet_id author avatar body date month_s date_s screenname')
  .where('date')
  .lt(current)
  .limit(max_items_per_page)
  .sort({date: 'desc'})
  .exec(function(err, data){

    //Nothing goes wrong
    if(!err) {
      tweets = data;  
    }

    //Pass data back
    callback(tweets);

  });

};

// Return a Tweet model based upon the defined schema
module.exports = Tweet = mongoose.model('Tweet', schema);
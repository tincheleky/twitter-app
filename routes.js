var JSX = require('node-jsx').install();
var React = require('react');
var TweetsApp = React.createFactory(require('./components/TweetsApp.react'));
var Tweet = require('./models/Tweet');
var ReactDOMServer = require('react-dom/server');

module.exports = {

  index: function(req, res) {
    //Get data from db
    Tweet.getTweets(0, new Date(), function(tweets, current, pages) {

      // Render React in server
      var markup = ReactDOMServer.renderToString(
        TweetsApp({
          tweets: tweets
        })
      );

      // Render 'home' template, response to client
      res.render('home', {
        markup: markup, 
        state: JSON.stringify(tweets) // server state to client
      });

    });
  },

  page: function(req, res) {
    // Fetch tweets by page via param
    Tweet.getTweets(req.params.page, req.params.current, function(tweets) {

      // Pass data as JSON to client
      res.send(tweets);

    });
  },

}

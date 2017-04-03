var React = require('react');
var Tweets = require('./Tweets.react.js');

module.exports = TweetsApp = React.createClass({

  // Set the initial component state
  getInitialState: function(props){

    props = props || this.props;

    // Set initial state using props
    return {
      tweets: props.tweets,
      count: 0,
      page: 0,
      paging: false,
      skip: 0,
      done: false,
    };

  },



  componentWillReceiveProps: function(newProps, oldProps){
    this.setState(this.getInitialState(newProps));
  },

  // Client Calls after component rendering
  componentDidMount: function(){

    // Preserve
    var self = this;

    // Attach scroll event to the browser
    window.addEventListener('scroll', this.checkWindowScroll);

  },

  // Method to get more tweets from server via ajax
  getPage: function(page){

    // Using ajax to fetched more tweets from server
    var request = new XMLHttpRequest(), self = this;
    var tweets = this.state.tweets;
    request.open('GET', 'page/' + page + "/" + tweets[tweets.length - 1].date, true);
    request.onload = function() {

      // If no errors
      if (request.status >= 200 && request.status < 400){

        // Load the next page
        self.loadPagedTweets(JSON.parse(request.responseText));

      } else {

        // Set application state (Not paging, paging complete)
        self.setState({paging: false, done: true});

      }
    };

    // Fire!
    request.send();

  },

  // Method to load tweets fetched from the server
  loadPagedTweets: function(tweets){

    //Preserve
    var self = this;

    //If there are tweets
    if(tweets.length > 0) {

      // Get current application state
      var updated = this.state.tweets;

      // Push them to the end of the tweets array
      tweets.forEach(function(tweet){
        updated.push(tweet);
      });
      
      self.setState({tweets: updated, paging: false});

    } else {

      // Set application state (Not paging, paging complete)
      this.setState({done: true, paging: false});

    }
  },

  // Function to check if more tweets should be loaded based on scroll position
  checkWindowScroll: function(){

    // Get scroll pos & window data
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var s = (document.body.scrollTop || document.documentElement.scrollTop || 0);
    var scrolled = (h + s) > document.body.offsetHeight;

    // If scrolled enough, not currently paging and not complete...
    if(scrolled && !this.state.paging && !this.state.done) {

      // Set application state (Paging, Increment page)
      this.setState({paging: true, page: this.state.page + 1});

      // Get the next page of tweets from the server
      this.getPage(this.state.page);

    }
  },

  // Render the component
  render: function(){

    return (
      
        <div className="tweets-app" >
          <Tweets tweets={this.state.tweets} />
        </div>
    )

  }

});
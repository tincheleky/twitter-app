var React = require('react');
var Tweet = require('./Tweet.react.js');

module.exports = Tweets = React.createClass({

  render: function(){

    var content = this.props.tweets.map(function(tweet){

      //Render list of items
      return (
        <Tweet key={tweet._id} tweet={tweet} />
      )
    });

    // Return ul filled with our mapped tweets
    return (
      <ul className="tweets">{content}</ul>
    )

  }

}); 
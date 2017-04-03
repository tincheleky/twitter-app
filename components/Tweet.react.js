var React = require('react');

module.exports = Tweet = React.createClass({
  render: function(){
    var tweet = this.props.tweet;

    //Render single item
    return (
        <li className="tweet active">
          <img src={tweet.avatar} className="profile-pic"/>
          <blockquote>
            <cite>
              <span className="full-name" >{tweet.author}</span> 
              <span className="screen-name">@{tweet.screenname}</span> 
              <span className="date">{tweet.month_s} {tweet.date_s}</span>

            </cite>
            <span className="content">{tweet.body}</span>
          </blockquote>
      </li>

    )
  }
});



import React from 'react';
import Poll from './Poll';
import Comments from './Comments';
import DonutChart from './Donut.js';
var Masonry = require('react-masonry-component');

var masonryOptions = {
    transitionDuration: 0,
    fitWidth: true
};

const Single = React.createClass({
  render() {
    const { pollId } = this.props.params;

    const i = this.props.polls.findIndex((poll) => poll.code === pollId);
    const poll = this.props.polls[i];

    const pollComments = this.props.comments[pollId] || [];

    return (
      <div>
        <Masonry
            className={'masonry-grid'} // default ''
            elementType={'div'} // default 'div'
            options={masonryOptions} // default {}
            disableImagesLoaded={false} // default false
            updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
        >
          <Poll i={i} poll={poll} {...this.props} />
          <DonutChart poll={poll} />
        </Masonry>
        <Comments pollComments={pollComments} {...this.props} />
      </div>
    )
  }
});

export default Single;

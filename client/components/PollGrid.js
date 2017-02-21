import React from 'react';
import Poll from './Poll';
var Masonry = require('react-masonry-component');

var masonryOptions = {
    transitionDuration: 0,
    fitWidth: true
};

const PollGrid = React.createClass({
  render() {
    return (
      <Masonry
          className={'masonry-grid'} // default ''
          elementType={'div'} // default 'div'
          options={masonryOptions} // default {}
          disableImagesLoaded={false} // default false
          updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
      >
        {this.props.polls.map((poll, i) => <Poll {...this.props} key={i} i={i} poll={poll} />)}
      </Masonry>
    )
  }
});

export default PollGrid;

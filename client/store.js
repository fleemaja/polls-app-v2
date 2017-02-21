import { createStore, compose } from 'redux';
import { syncHistoryWithStore} from 'react-router-redux';
import { browserHistory } from 'react-router';

// import the root reducer
import rootReducer from './reducers/index';

import commentData from './data/comments';
import pollData from './data/polls';

const comments = JSON.parse(localStorage.getItem('_comments')) || commentData;
const polls = JSON.parse(localStorage.getItem('_polls')) || pollData;

// create an object for the default data
const defaultState = {
  polls,
  comments
};

const store = createStore(rootReducer, defaultState);

export const history = syncHistoryWithStore(browserHistory, store);

if(module.hot) {
  module.hot.accept('./reducers/',() => {
    const nextRootReducer = require('./reducers/index').default;
    store.replaceReducer(nextRootReducer);
  });
}

export default store;

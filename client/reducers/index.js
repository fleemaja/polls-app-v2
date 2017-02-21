import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import comments from './comments';
import polls from './polls';

const rootReducer = combineReducers({comments, polls, routing: routerReducer });

export default rootReducer;

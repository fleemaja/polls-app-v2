function postComments(state = [], action) {
  switch(action.type){
    case 'ADD_COMMENT':
      // return the new state with the new comment
      var comments = [{
        user: action.author,
        text: action.comment
      },...state];
      localStorage.setItem('_comments', JSON.stringify(comments));
      return comments;
    case 'REMOVE_COMMENT':
      // we need to return the new state without the deleted comment
      var comments = [
        // from the start to the one we want to delete
        ...state.slice(0,action.i),
        // after the deleted one, to the end
        ...state.slice(action.i + 1)
      ];
      localStorage.setItem('_comments', JSON.stringify(comments));
      return comments;
    default:
      return state;
  }
  return state;
}

function comments(state = [], action) {
  if(typeof action.postId !== 'undefined') {
    var comments = {
      // take the current state
      ...state,
      // overwrite this post with a new one
      [action.postId]: postComments(state[action.postId], action)
    }
    localStorage.setItem('_comments', JSON.stringify(comments));
    return comments;
  }
  return state;
}

export default comments;

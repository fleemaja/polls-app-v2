function polls(state = [], action) {
  switch(action.type) {
    case 'INCREMENT_VOTES' :
      console.log("Incrementing VOTES!!");
      const i = action.index;
      const j = action.optionIndex;
      var pollVote = [
        ...state.slice(0,i), // before the one we are updating
        {...state[i], votes: state[i].votes + 1},
        ...state.slice(i + 1), // after the one we are updating
      ];
      var optionVote = [
        ...pollVote.slice(0,i), // before the one we are updating
        {...pollVote[i], options: [
            ...pollVote[i].options.slice(0, j),
            {...pollVote[i].options[j], votes: pollVote[i].options[j].votes + 1 },
            ...pollVote[i].options.slice(j + 1),
          ]
        },
        ...pollVote.slice(i + 1), // after the one we are updating
      ];
      localStorage.setItem('_polls', JSON.stringify(optionVote));
      return optionVote;
    default:
      return state;
  }
}

export default polls;

import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  paper: {
      width: 300,
      padding: 10,
      margin: 20,
      display: 'inline-block',
  },
  radioButton: {
    marginBottom: 16
  },
  raisedButton: {
    margin: 0
  }
};

const Poll = React.createClass({
  getInitialState() {
    const localPolls = JSON.parse(localStorage.getItem('_userVotes')) || null;
    var userVoted = false;
    var userOption = "";
    const index = this.props.i;
    if (localPolls !== null) {
      localPolls.forEach(function(lp) {
        if (lp.i == index) {
          userVoted = true;
          userOption = lp.option;
        }
      })
    }
    return { voted: userVoted, disabled: true, selectedOption: userOption };
  },
  makeVote() {
    const index = this.props.i;
    const selectedOption = this.state.selectedOption;

    const localVotes = JSON.parse(localStorage.getItem('_userVotes')) || [];
    localVotes.push({"i": index, "option": selectedOption });
    localStorage.setItem('_userVotes', JSON.stringify(localVotes));

    var optionIndex;
    this.props.poll.options.forEach(function(o, j) {
      if (o['option'] === selectedOption) {
        optionIndex = j;
      }
    });
    this.props.vote(index, optionIndex);
    this.setState({ voted: true });
  },
  selectOption(changeEvent) {
    this.setState({ disabled: false, selectedOption: changeEvent.target.value })
  },
  render() {
    const poll = this.props.poll;
    const comments = this.props.comments;
    const pollVotes = poll.votes;
    const that = this;
    if (this.state.voted) {
      return (
        <Paper style={styles.paper}>
          <div>
            <Link className="poll-title" to={`/view/${poll.code}`}>
              <p>{poll.title}</p>
            </Link>
            <div className="options">
              {poll.options.map(function(o, i){
                const percent = o['votes']/pollVotes;
                if (that.state.selectedOption === o['option']) {
                  return (
                    <div className="result-bar" style={{width: percent * 280, background: '#77C7F7'}}>
                      <span><strong>{Math.round(percent * 100) + "% "}</strong><span>{o['option']}</span></span>
                    </div>
                  )
                } else {
                  return (
                    <div className="result-bar" style={{width: percent * 280, background: '#ddd'}}>
                      <span><strong>{Math.round(percent * 100) + "% "}</strong><span>{o['option']}</span></span>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </Paper>
      )
    } else {
      return (
        <Paper style={styles.paper}>
          <div>
            <Link className="poll-title" to={`/view/${poll.code}`}>
              <p>{poll.title}</p>
            </Link>
            <div className="options">
              <RadioButtonGroup name="option" onChange={this.selectOption}>
                {poll.options.map(function(o, i){
                  return <RadioButton value={o['option']} label={o['option']}
                         aria-label={o['option']} key={i} 
                         style={styles.radioButton} />
                })}
              </RadioButtonGroup>
            </div>
            <RaisedButton disabledLabelColor="#333" disabled={this.state.disabled} onClick={this.makeVote} label="Vote" style={styles.raisedButton} />
          </div>
        </Paper>
      )
    }
  }
});

export default Poll;

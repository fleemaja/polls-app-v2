import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { blue500 } from 'material-ui/styles/colors';

const Comments = React.createClass({
  getInitialState() {
    return ({ author: "", comment: "", aErrorText: "", cErrorText: "" })
  },
  _handleAuthorChange: function(e) {
        this.setState({
            author: e.target.value
        });
  },
  _handleCommentChange: function(e) {
        this.setState({
            comment: e.target.value
        });
  },
  _setAuthorErrorText: function() {
    if (this.state.author === "") {
      this.setState({aErrorText: "Author name is required to submit a comment"});
    } else {
      this.setState({aErrorText: ""})
    }
  },
  _setCommentErrorText: function() {
    if (this.state.comment === "") {
      this.setState({cErrorText: "Comment text is required to submit a comment"});
    } else {
      this.setState({cErrorText: ""})
    }
  },
  renderComment(comment, i) {
    return (
      <div className="comment" key={i}>
        <p>
          <strong>{comment.user}</strong>
          {comment.text}
          <button className="remove-comment" onClick={this.props.removeComment.bind(null, this.props.params.pollId, i)}>&times;</button>
        </p>
      </div>
    )
  },
  handleSubmit(e) {
    e.preventDefault();
    const { pollId } = this.props.params;
    const author = this.state.author;
    const comment = this.state.comment;
    if (author === "" || comment === "") {
      this._setAuthorErrorText();
      this._setCommentErrorText();
    } else {
      this.props.addComment(pollId, author, comment);
      this.setState(this.getInitialState());
    }
  },
  render() {
    const styles = {
      "button": {
        "marginTop": 20
      },
      "floating": {
        "color": "#767676"
      }
    };
    return (
      <div className="comments-section">
        <h2>Comments</h2>
        <Paper>
          <div className="comments-content">
            <form ref="commentForm" className="comment-form" onSubmit={this.handleSubmit}>
              <TextField value={this.state.author}
                         onChange={this._handleAuthorChange}
                         onBlur={this._setAuthorErrorText}
                         errorText={this.state.aErrorText}
                         floatingLabelText="Author"
                         floatingLabelStyle={styles.floating}/><br/>
              <TextField value={this.state.comment}
                         onChange={this._handleCommentChange}
                         onBlur={this._setCommentErrorText}
                         fullWidth={true}
                         errorText={this.state.cErrorText}
                         floatingLabelText="Comment"
                         floatingLabelStyle={styles.floating}/>
              <input type="submit" hidden />
              <RaisedButton label="Submit" style={styles.button} backgroundColor="#007aca" labelColor="#fff" onClick={this.handleSubmit} />
            </form>
            <div className="commented">
              {this.props.pollComments.map(this.renderComment)}
            </div>
          </div>
        </Paper>
      </div>
    )
  }
});

export default Comments;

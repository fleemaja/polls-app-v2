var _ = require('lodash');
var Poll = require('../models/polls.js');
var path = process.cwd();

// Get index page (polls are fetched through the api endpoint)
exports.index = function(req, res) {
    var showObj = { user: null };
    if (req.user) {
      showObj['user'] = req.user._id.toString()
		}
    return res.render(path + '/public/index.ejs', showObj);
};

exports.userPolls = function(req, res) {
    var showObj = { user: null };
    if (req.user) {
      showObj['user'] = req.user._id.toString()
		}
    return res.render(path + '/public/mypolls.ejs', showObj);
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var showObj = { user: null, poll: poll };
    if (req.user) {
      showObj['user'] = req.user._id.toString();
  	}
    return res.render(path + '/public/show.ejs', showObj);
  })
};

exports.showAPI = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var userPoll = {};
    userPoll.title = poll.title;
    userPoll._id = poll._id;
    userPoll.options = poll.options;
    userPoll.category = poll.category;
    userPoll.voters = poll.voters;
    userPoll.date = poll.date;
    userPoll.userChoice = null;
    userPoll.username = poll.username;
    userPoll.user = poll.user;
    if (req.user) {
      poll.voters.forEach(function(vote) {
        if (vote[0] === req.user._id.toString()) {
          userPoll['userChoice'] = vote[1];
        }
      })
    }
    return res.status(200).json(userPoll);
  });
}

exports.apiPolls = function(req, res) {
  var category = req.query.category;
  var sortType = req.query.sortType;
  var param = {};
  
  if (req.query.myPolls) {
    var param = { user: req.user._id };
  } 
  
  var user = null;
  if (req.user) {
    user = req.user._id.toString();
  }
  
  Poll.find(param, function(err, polls) {
    if(err) { return handleError(res, err); }
    var filteredPolls = polls.concat();
    if (category !== "all") {
      filteredPolls = filteredPolls.filter(function(poll) {
        if (poll.category === category) {
          return poll;
        }
      });
    }
    var sortedPolls;
    if (sortType === "most") {
      sortedPolls = filteredPolls.concat().sort(function(p1, p2) {
        var p1Votes = 0;
        p1.options.forEach(function(o) {
          p1Votes += o.votes;
        });
        var p2Votes = 0;
        p2.options.forEach(function(o) {
          p2Votes += o.votes;
        });
        return p2Votes - p1Votes;
      });
    } else if (sortType === "newest") {
      sortedPolls = filteredPolls.concat().sort(function(p1, p2) {
        return p2.date - p1.date;
      });
    }
    
    var choicePolls = [];
    sortedPolls.forEach(function(sPoll) {
      var userPoll = {};
      userPoll.title = sPoll.title;
      userPoll._id = sPoll._id;
      userPoll.options = sPoll.options;
      userPoll.category = sPoll.category;
      userPoll.voters = sPoll.voters;
      userPoll.date = sPoll.date;
      userPoll.userChoice = null;
      userPoll.username = sPoll.username;
      userPoll.user = sPoll.user;
      if (user) {
        sPoll.voters.forEach(function(vote) {
          if (vote[0] === user) {
            userPoll['userChoice'] = vote[1];
          }
        })
      }
      choicePolls.push(userPoll);
    })
    
    return res.status(200).json(choicePolls);
  });
}

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var options = req.body.options.split(",").filter(function(o) { return o != '' });
  var options = options.map(function(op) { return op.slice(0, 41) });
  var options = options.getUnique();
  var parsedPoll = req.body;
  var parsedOptions = [];
  for (var i = 0; i < options.length; i++) {
    parsedOptions.push({
      text: options[i],
      votes: 0
    });
  }
  parsedPoll.options = parsedOptions;
  parsedPoll.user = req.user.id;
  parsedPoll.username = req.user.local.username;
  Poll.create(parsedPoll, function(err, poll) {
    if(err) { return handleError(res, err); }
    var showObj = { poll: poll, user: null };
    if (req.user) {
      showObj['user'] = req.user._id.toString()
		}
    return res.redirect('/polls/' + poll._id.toString());
  });
};

// adds a voter to the object
exports.vote = function(req, res) {
  var choice = req.body.option.slice(0, 41).replace(/\&/g, '&amp;').replace(/\"/g, '&quot;');
  choice = choice.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
  
  var user = null;
  if (req.user) {
    user = req.user._id.toString();
  }
  
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var updated = _.extend(poll, req.body);
    var voters = [];
    poll.voters.forEach(function(vote) {
      voters.push(vote[0]);
    });
    if (user) {
      var userNotVoted = voters.indexOf(user) === -1;
    }
    
    var messageJSON;
    if (user && userNotVoted) {
      updated.options.forEach(function(option) {
        if (option.text === choice) {
          option.votes += 1;
          poll.voters.push([user, choice]);
          messageJSON = poll;
          messageJSON['userChoice'] = choice;
        }
      });
    } else if (user && !userNotVoted) {
      messageJSON = { 'message': "You have already voted" };
    } else {
      messageJSON = { 'message': "Login to vote" };
    }

    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(messageJSON);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }

    // Only owners may delete
    if(poll.user.toString() === req.user._id.toString()) {
      poll.remove(function(err) {
        if(err) { return handleError(res, err); }
        Poll.find(function (err, polls) {
          if(err) { return handleError(res, err); }
          var showObj = { polls: polls, user: null };
          if (req.user) {
            showObj['user'] = req.user._id.toString();
          }
          return res.render(path + '/public/index.ejs', showObj);
        });
      });
    } else {
      return res.status(403).send('You do not have permission to delete this item');
    }
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
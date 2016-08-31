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

exports.apiPolls = function(req, res) {
  var category = req.query.category;
  var sortType = req.query.sortType;
  
  Poll.find(function(err, polls) {
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
      sortedPolls = filteredPolls.concat().reverse();
    }
    
    return res.status(200).json(sortedPolls);
  });
}

// Get list of polls
exports.userPolls = function(req, res) {
  Poll.find({ user: req.user._id }, function (err, polls) {
    if(err) { return handleError(res, err); }
    var voteSorted = polls.concat().sort(function(p1, p2) {
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
    return res.render(path + '/public/mypolls.ejs', {
				polls: voteSorted,
				user: req.user._id.toString()
		});
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var showObj = { poll: poll, user: null };
    if (req.user) {
      showObj['user'] = req.user._id.toString()
		}
    return res.render(path + '/public/show.ejs', showObj);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  var options = req.body.options.split("\r\n").filter(function(o) { return o != '' });
  var options = options.map(function(op) { return op.slice(0, 50) });
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
  Poll.create(parsedPoll, function(err, poll) {
    if(err) { return handleError(res, err); }
    var showObj = { poll: poll, user: null };
    if (req.user) {
      showObj['user'] = req.user._id.toString()
		}
    return res.render(path + '/public/show.ejs', showObj);
  });
};

// adds a voter to the object
exports.vote = function(req, res) {
  var choice = req.body.option.slice(0, 50);
  
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.status(404).send('Not Found'); }
    var updated = _.extend(poll, req.body);
    
    var newOption = true;
    updated.options.forEach(function(option) {
      if (option.text === choice) {
        option.votes += 1;
        newOption = false;
      }
    });
    if (newOption && choice != "") {
      updated.options.push({
        text: choice,
        votes: 1
      })
    }

    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      var showObj = { poll: poll, user: null };
      if (req.user) {
        showObj['user'] = req.user._id.toString()
  		}
      return res.redirect(req.get('referer'));
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
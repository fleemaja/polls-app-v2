'use strict';

var User = require('../models/users.js');
var path = process.cwd();

exports.update = function(req, res) {
    var avatarURL = req.body.avatarURL;
    
    User.findById(req.params.id, function(err, user) {
        if (err) { return handleError(res, err); }
        if(!user) { return res.status(404).send("Not found"); }
        user.avatarURL = avatarURL;
        user.save(function (err) {
          if (err) { return handleError(res, err); }
          return res.status(200).json(user);
        });
    })
}

exports.getAvatar = function(req, res) {
    User.findById(req.params.id, function(err, user) {
        if (err) { return handleError(res, err); }
        if(!user) { return res.status(404).send("Not found"); }
        return res.status(200).json({ 'avatarURL': user.avatarURL });
    });
}

function handleError(res, err) {
  return res.status(500).send(err);
}
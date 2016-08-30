'use strict';

var sanitizeHtml = require('sanitize-html');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var relationship = require("mongoose-relationship");
var User = require('./users.js');

var PollSchema = new Schema({
    created: Date,
	title: { type: String, required: true },
    user: { type:Schema.ObjectId, ref:"User", childPath:"polls" },
    options: {
        type: [{
            text: String,
            votes: Number
        }],
        validate: [arrayMin, 'Not enough Poll Options']
    },
    category: { type: String, required: true, enum: ['sports', 'movies', 'music', 'food', 'science', 'news', 'misc'] },
    voters: []
});


function arrayMin(val) {
  return val.length >= 2;
}

// Automatically remove HTML from public facing fields on save
PollSchema.pre('save', function(next) {
  var sanitize = {
    allowedTags: [],
    allowedAttributes: []
  };

  this.title = sanitizeHtml(this.title, sanitize);
  this.title = this.title.slice(0, 140);
  this.options = this.options.map(function(option){
      option.text = sanitizeHtml(option.text, sanitize);
      // 50 char max
      option.text = option.text.slice(0, 50);
      return option;
    });
  next();
});


PollSchema.plugin(relationship, { relationshipPathName:'user' });

module.exports = mongoose.model('Poll', PollSchema);
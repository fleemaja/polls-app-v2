// signup form pre-submit validation
var nameTooltip = $('#username-tooltip');

var passwordOneTooltip = $('#password-1-tooltip');
var passwordTwoTooltip = $('#password-2-tooltip');

$('#username').focusout(function() {
  if (!isNameValid()) {
    nameTooltip.css('opacity', 1);
  }
});

$('#username').focusin(function() {
  nameTooltip.css('opacity', 0);
});

function isNameValid() {
  var name = $('#username').val();
  return name === "" ? false : true;
}

var firstPasswordInput = $('#password-input');
var secondPasswordInput = $('#password-input-2');

firstPasswordInput.focusout(function() {
  var issues = passwordIssues();
  if (!isPasswordValid(issues)) {
    passwordOneTooltip.html('<span class="dot">!</span>' + issues);
    passwordOneTooltip.css('opacity', 1);
  }
});

firstPasswordInput.focusin(function() {
  passwordOneTooltip.css('opacity', 0);
});

secondPasswordInput.focusout(function() {
  var issues = secondPasswordIssues();
  if (!isPasswordValid(issues)) {
    passwordTwoTooltip.html('<span class="dot">!</span>' + issues);
    passwordTwoTooltip.css('opacity', 1);
  }
});

secondPasswordInput.focusin(function() {
  passwordTwoTooltip.css('opacity', 0);
});

function passwordIssues() {
  var firstPassword = firstPasswordInput.val();
  var firstInputIssuesTracker = new IssueTracker();

  if (firstPassword.length < 8) {
    firstInputIssuesTracker.add("fewer than 8 characters");
  } else if (firstPassword.length > 50) {
    firstInputIssuesTracker.add("greater than 50 characters");
  }

  if (!firstPassword.match(/\d/g)) {
    firstInputIssuesTracker.add("missing a number");
  }

  if (!firstPassword.match(/[a-z]/g)) {
    firstInputIssuesTracker.add("missing a lowercase letter");
  }

  if (!firstPassword.match(/[A-Z]/g)) {
    firstInputIssuesTracker.add("missing an uppercase letter");
  }

  return firstInputIssuesTracker.retrieve();
}

function secondPasswordIssues() {
  var firstPassword = firstPasswordInput.val();
  var secondPassword = secondPasswordInput.val();
  var secondInputIssuesTracker = new IssueTracker();

  if (firstPassword !== secondPassword) {
    secondInputIssuesTracker.add("Passwords must match!");
  }

  return secondInputIssuesTracker.retrieve();
}

function isPasswordValid(issues) {
  return issues.length > 0 ? false : true;
}

function IssueTracker() {
  this.issues = [];
}
IssueTracker.prototype = {
  add: function (issue) {
    this.issues.push(issue);
  },
  retrieve: function () {
    var message = "";
    switch (this.issues.length) {
      case 0:
        // do nothing because message is already ""
        break;
      case 1:
        message = "Please correct the following issue:\n" + this.issues[0];
        break;
      default:
        message = "Please correct the following issues:\n" + this.issues.join(", ");
        break;
    }
    return message;
  }
};

$('#signup-submit').click(function(e) {
  var preventDefault = false;

  if (!isNameValid()) {
    preventDefault = true;
    nameTooltip.css('opacity', 1);
  }

  var issues = passwordIssues();
  if (!isPasswordValid(issues)) {
    preventDefault = true;
    passwordOneTooltip.html('<span class="dot">!</span>' + issues);
    passwordOneTooltip.css('opacity', 1);
  }

  var verificationIssues = secondPasswordIssues();
  if (!isPasswordValid(verificationIssues)) {
    preventDefault = true;
    passwordTwoTooltip.html('<span class="dot">!</span>' + verificationIssues);
    passwordTwoTooltip.css('opacity', 1);
  }

  if (preventDefault) {
    e.preventDefault();
  }
});

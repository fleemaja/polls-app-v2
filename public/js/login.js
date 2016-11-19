// signup form pre-submit validation
var nameTooltip = $('#username-tooltip');
var passwordTooltip = $('#password-tooltip');

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

$('#password-input').focusout(function() {
  if (!isPasswordValid()) {
    passwordTooltip.css('opacity', 1);
  }
});

$('#password-input').focusin(function() {
  passwordTooltip.css('opacity', 0);
});

function isPasswordValid() {
  var password = $('#password-input').val();
  return password === "" ? false : true;
}

$('#login-submit').click(function(e) {
  var preventDefault = false;

  if (!isNameValid()) {
    preventDefault = true;
    nameTooltip.css('opacity', 1);
  }

  if (!isPasswordValid()) {
    preventDefault = true;
    passwordTooltip.css('opacity', 1);
  }

  if (preventDefault) {
    e.preventDefault();
  }
});

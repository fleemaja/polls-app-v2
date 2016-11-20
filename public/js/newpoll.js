var CHOICE = 3;
$('#add-choice').click(function(e) {
  $('#options-field').append('<input type="text" class="form-control pollOptionsInput" aria-label="Choice ' + CHOICE + ' (optional)" placeholder="Choice ' + CHOICE + ' (optional)" >');
  CHOICE += 1;
})

$('#options-field').change(function() {
  var options = [];
  $(".pollOptionsInput").each(function() {
    var optionVal = $(this).val().replace(/\,/g, '&#44;');
    options.push(optionVal);
  });
  $('#pollOptionsInput').val(options);
})

var categoryTooltip = $('#category-tooltip');
var titleTooltip = $('#title-tooltip');
var optionsTooltip = $('#options-tooltip');

$('#pollCategoryInput').focusout(function() {
  if ($('#pollCategoryInput').val() == null) {
    categoryTooltip.css('opacity', 1);
  }
});

$('#pollCategoryInput').focusin(function() {
  categoryTooltip.css('opacity', 0);
});

$('#pollTitleInput').focusout(function() {
  if ($('#pollTitleInput').val() == "") {
    titleTooltip.css('opacity', 1);
  }
});

$('#pollTitleInput').focusin(function() {
  titleTooltip.css('opacity', 0);
});

$('#newpoll-submit').click(function(e) {
  var valid = true;
  if ($('#pollCategoryInput').val() == null) {
      valid = false;
      categoryTooltip.css('opacity', 1);;
  }
  if ($('#pollTitleInput').val() == "") {
      valid = false;
      titleTooltip.css('opacity', 1);
  }
  var rawOptions = $('#pollOptionsInput').val();
  var optionsArr = rawOptions.split(",");
  optionsArr = optionsArr.filter(function(o) { return o != '' });
  if (optionsArr.length < 2) {
      valid = false;
      optionsTooltip.css('opacity', 1);
  }
  if (!valid) {
    e.preventDefault();
  }
});

var msnry = new Masonry( '.grid', {
				  columnWidth: 350,
				  isFitWidth: true,
				  gutter: 20,
				  itemSelector: '.grid-item'
				});

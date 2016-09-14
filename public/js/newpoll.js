var CHOICE = 3;
$('#add-choice').click(function(e) {
  $('#options-field').append('<input type="text" class="form-control pollOptionsInput" placeholder="Choice ' + CHOICE + ' (optional)" >');
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

$(document).ready(function() {
  $('form').on('submit', function(e){
    // validation code here
    var valid = true;
    
    var rawOptions = $('#pollOptionsInput').val();
    var optionsArr = rawOptions.split(",");
    optionsArr = optionsArr.filter(function(o) { return o != '' });
    if ($('#pollCategoryInput').val() == null) {
        valid = false;
        $('.alert-category').show();
    }
    if (optionsArr.length < 2) {
        valid = false;
        $('.alert-options').show();
    }
    if(!valid) {
      e.preventDefault();
    }
  });
});

var msnry = new Masonry( '.grid', {
				  columnWidth: 350,
				  isFitWidth: true, 
				  gutter: 20,
				  itemSelector: '.grid-item'
				});
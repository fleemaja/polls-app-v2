$(document).ready(function() {
      $('form').on('submit', function(e){
          if ($('input[name="password"]').val() !== $('#verify-password').val()) {
              e.preventDefault();
              $('#verify').show();
          }
      });
});
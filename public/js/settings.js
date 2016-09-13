var CLOUDINARY_OPTIONS = {
    cloud_name: "<%= process.env.CLOUD_NAME %>",
    upload_preset: "<%= process.env.UPLOAD_PRESET %>",
    theme: 'minimal',
    multiple: false,
    max_image_width: 96,
    max_image_height: 96
};

var msnry = new Masonry( '.grid', {
			  columnWidth: 350,
			  isFitWidth: true, 
			  gutter: 20,
			  itemSelector: '.grid-item'
			});
			
$('button').click(function() {
    cloudinary.openUploadWidget(CLOUDINARY_OPTIONS, function(error, results){
   if(!error){
     var imgURL = results[0].secure_url;
     
     
     $.ajax({
     	url: "https://polls-app-v2-fleemaja.c9users.io/settings/<%= user %>",
        type: 'post',
        data: {
        	avatarURL: imgURL
        },
        success: function() {
        	$('.avatar').attr('src', imgURL);
        }
     })
   }
 });
})
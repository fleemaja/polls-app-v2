var modal = $('#myModal');
var warningModal = $('#warningModal');
var appURL = 'https://still-oasis-41820.herokuapp.com/';

$('document').ready(function() {
	getPolls();
});

$('.close').on('click', function() {
	modal.hide();
});

$('.cancel-btn').on('click', function() {
	warningModal.hide();
})

$('body').on('click', '.remove-button', function(e) {
	var pollID = $(e.currentTarget).attr('id');
	var pollTitle = $(e.currentTarget).data("title");
	$('.warning-poll-title').html("'" + pollTitle + "'");
	$('.confirm-btn').data('pollID', pollID);
	warningModal.show();
});

$('.confirm-btn').on("click", function() {
	var pollID = $(this).data('pollID');
	$.ajax({
		url: appURL + "delete/" + pollID,
		type: 'post',
		success: function() {
			getPolls();
			warningModal.hide();
		}
	})
})

$('.grid').on('click', 'input[type="radio"]', function() {
    var parentID = $(this).parent().attr('id');
    $("#" + parentID + ' input[type="submit"]').prop('disabled', false);
});

$('.grid').on('click', 'input[type="submit"]', function(e) {
    e.preventDefault();
    
    var form = $(e.currentTarget).parent();
    var formID = form.attr('id');
   
    var selectedOption = $('input[name=option]:checked', "#" + formID).val();
    
    $.ajax({
    	url: appURL + "polls/" + formID,
    	type: 'post',
    	data: {
    		option: selectedOption
    	},
    	success: function(json) {
    		if (json.hasOwnProperty('message')) {
    			if (json['message'] === "Login to vote") {
    				modal.show();
    			}
    		} else {
    			html = "";
    			var totalVotes = json.voters.length;
	    		json.options.forEach(function(o) {
    				var optionText = $('<textarea />').html(o.text).text();
    				var optionPercent = Math.round(parseFloat(o.votes/totalVotes) * 100).toString() + "%";
    				var optionPercentPadding = "";
    				if (optionPercent.length === 3) {
    					optionPercentPadding = 7;
    				} else if (optionPercent.length === 2) {
    					optionPercentPadding = 15;
    				} else {
    					optionPercentPadding = 0;
    				}
    				
					if (selectedOption === optionText) {
					    html += "<span class='option-bar user-option' style='width:" + optionPercent + ";' ><span class='option-info'><span class='option-percent' style='padding-left: " + optionPercentPadding + "px;' >" + optionPercent + "</span>" + optionText + "</span><i class='fa fa-check-circle-o' aria-hidden='true'></i>" + "</span>";
					} else {
						html += "<span class='option-bar' style='width:" + optionPercent + ";' ><span class='option-info'><span class='option-percent' style='padding-left: " + optionPercentPadding + "px;'>" + optionPercent + "</span>" + optionText + "</span></span>";
					}
	    		});
	    		html += "<span class='total-votes'>" + totalVotes + " votes</span>";
	    		html += "<span class='total-votes'>&bull;</span>";
	    		html += "<span class='total-votes'>" + displayCategory[json.category] + "</span>";
    			form.html(html);
    		}
    	}
    })
});

$('#select-sort').on('change', function() {
	getPolls();
});

$('#select-category').on('change', function() {
	getPolls();
});

var monthNumsToStrs = {
	'01': 'Jan',
	'02': 'Feb',
	'03': 'Mar',
	'04': 'Apr',
	'05': 'May',
	'06': 'Jun',
	'07': 'Jul',
	'08': 'Aug',
	'09': 'Sep',
	'10': 'Oct',
	'11': 'Nov',
	'12': 'Dec'
}

var displayCategory = {
	'science': 'Science & Technology',
	'music': 'Music & Art',
	'sports': 'Sports & Fitness',
	'movies': 'Movies & TV',
	'food': 'Food & Travel',
	'misc': 'Miscellaneous',
	'news': 'News & Politics'
}

function formatDate(date) {
	var dateEls = date.split("-");
	var month = monthNumsToStrs[dateEls[1]];
	var day = parseInt(dateEls[2], 10);
	
	return month + " " + day;
}

function getPolls() {
	var category = $('#select-category').val();
    var sortType = $('#select-sort').val();
    
	$.ajax({
	  	url: appURL + "api",
	  	dataType: 'json',
	    data: { 
	        "category": category,
	        "sortType": sortType,
	        "myPolls": true
	    },
	    success: function(json) {
	    	if (json.length < 1) {
	    		html = "<div class='grid-item'><h3 id='no-message'>No polls. <a href='/newpoll' id='empty-message'>Create a new poll</a></h3></div>";
	    	} else {
		    	html = "";
		    	json.forEach(function(poll) {
		    		var pollTitle = $('<textarea />').html(poll.title).text();
		    		html += "<div class='grid-item'>";
		    		html += "<img src='' class='avatar " + poll.user + "' >";
		    		$.ajax({
		    			url: 'https://still-oasis-41820.herokuapp.com/' + "settings/" + poll.user,
		    			type: 'get',
		    			success: function(json) {
		    				$('.' + poll.user).attr('src', json['avatarURL']);
		    			}
		    		})
		    		html += "<span><b>" + poll.username + " </b>" + "<span class='date-display'>" + formatDate(poll.date) + "</span><span class='remove-button' data-title='" + pollTitle + "' id=" + poll._id + ">X</span><span>";
		    		html += "<h3><a href='/polls/" + poll._id + "' >" + pollTitle + "</a></h3>";
		    		html += "<form action='/polls/" + poll._id + "' method='post' id=" + poll._id + ">";
		    		var totalVotes = poll.voters.length;
		    		poll.options.forEach(function(o) {
	    				var optionText = $('<textarea />').html(o.text).text();
	    				var optionPercent = Math.round(parseFloat(o.votes/totalVotes) * 100).toString() + "%";
	    				var optionPercentPadding = "";
	    				if (optionPercent.length === 3) {
	    					optionPercentPadding = 7;
	    				} else if (optionPercent.length === 2) {
	    					optionPercentPadding = 15;
	    				} else {
	    					optionPercentPadding = 0;
	    				}
	    				if (poll.userChoice) {
	    					var uChoice = $('<textarea />').html(poll.userChoice).text();
	    					if (uChoice === optionText) {
	    					    html += "<span class='option-bar user-option' style='width:" + optionPercent + ";' ><span class='option-info'><span class='option-percent' style='padding-left: " + optionPercentPadding + "px;' >" + optionPercent + "</span>" + optionText + "</span><i class='fa fa-check-circle-o' aria-hidden='true'></i>" + "</span>";
	    					} else {
	    						html += "<span class='option-bar' style='width:" + optionPercent + ";' ><span class='option-info'><span class='option-percent' style='padding-left: " + optionPercentPadding + "px;'>" + optionPercent + "</span>" + optionText + "</span></span>";
	    					}
    					} else {
		    				html += "<input type='radio' name='option' class='regular-radio big-radio' value=\'" + optionText.replace(/\'/g, '&#39;') + "\' >";
			    			html += "<span class='text-option'>" + optionText + "</span><br>";
		    			}
		    		});
		    		if (!poll.userChoice) {
		    			html += "<input class='btn btn-secondary' type='submit' value='Vote'>";
		    		}
		    		html += "<span class='total-votes'>" + totalVotes + " votes</span>";
		    		html += "<span class='total-votes'>&bull;</span>";
		    		html += "<span class='total-votes'>" + displayCategory[poll.category] + "</span>";
		    		html += "</form></div>";
		    	});
	    	}
	    	$('.grid').html(html);
	    	
	    	$('input[type="submit"]').prop("disabled", true);
	    	
	    	var msnry = new Masonry( '.grid', {
			  columnWidth: 350,
			  isFitWidth: true, 
			  gutter: 20,
			  itemSelector: '.grid-item'
			});
	    }
	});
}
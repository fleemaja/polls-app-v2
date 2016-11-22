var modal = $('#myModal');
var appURL = 'http://localhost:8080/';

$('document').ready(function() {
	getPoll();
	getChart();
});

$('.close').on('click', function() {
	modal.hide();
});

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
    			optionIDX = 0;
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
						var chartData = $('#myDoughnutChart').attr("chart-data").split(",").map(function(item) {
                          return parseInt(item, 10);
                        });
						chartData[optionIDX] += 1;
						$('#myDoughnutChart').attr("chart-data", chartData);
					    html += "<span class='option-bar user-option' style='width:" + optionPercent + ";' ><span class='option-info'><span class='option-percent' style='padding-left: " + optionPercentPadding + "px;' >" + optionPercent + "</span>" + optionText + "</span><i class='fa fa-check-circle-o' aria-hidden='true'></i>" + "</span>";
					} else {
						html += "<span class='option-bar' style='width:" + optionPercent + ";' ><span class='option-info'><span class='option-percent' style='padding-left: " + optionPercentPadding + "px;'>" + optionPercent + "</span>" + optionText + "</span></span>";
					}
					optionIDX += 1;
	    		});
	    		html += "<span class='total-votes'>" + totalVotes + " votes</span>";
	    		html += "<span class='total-votes'>&bull;</span>";
	    		html += "<span class='total-votes'>" + displayCategory[json.category] + "</span>";
    			form.html(html);
    			getChart();
    		}
    	}
    })
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

function getChart() {
	var ctx = $("#myDoughnutChart");

    var optionVotes = ctx.get(0).getAttribute("chart-data").split(",").map(function(item) {
                          return parseInt(item, 10);
                      });
    var optionLabels = ctx.get(0).getAttribute("chart-labels").split(",").map(function(ol) {
					      return ol.replace(/&#44;/g, ',');
					  });

    var myDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: optionLabels,
            datasets: [
                {
                    data: optionVotes,
                    backgroundColor: [
                        "rgba(247,70,74,0.6)",
                        "rgba(70,191,189,0.6)",
                        "rgba(253,180,92,0.6)",
                        "rgba(151,187,205,0.6)",
                        "rgba(220,220,220,0.6)",
                        "rgba(148,159,177,0.6)",
                        "rgba(77,83,96,0.6)"
                    ]
                }]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            animationEasing: "easeOutQuart",
            animationSteps: 40
        }
    });
}

function getPoll() {
	var pollID = $('.grid').attr('id');

	$.ajax({
	  	url: appURL + "api/" + pollID,
	  	dataType: 'json',
	    success: function(poll) {
	    	html = "";
    		var pollTitle = $('<textarea />').html(poll.title).text();
    		html += "<div class='grid-item' id='show-grid-item'>";
    		html += "<img src='' class='avatar " + poll.user + "' alt='' >";
    		$.ajax({
    			url: appURL + "settings/" + poll.user,
    			type: 'get',
    			success: function(json) {
    				$('.' + poll.user).attr('src', json['avatarURL']);
    			}
    		})
    		html += "<span><b>" + poll.username + " </b>" + "<span class='date-display'>" + formatDate(poll.date) + "</span><span>";
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

	    	$('.grid').prepend(html);

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

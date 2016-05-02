
var liveFeedMap = {"FrontDoor": "http://98.169.112.154:5000/liveVideoFeed", "Entrance": "http://73.231.84.97:5000/liveVideoFeed", "Garage": "http://107.15.188.73:5000/liveVideoFeed"};

function videoTypeSelection(val) {
	var RPiName = document.getElementById("RPiNameSelect").value;
	if (val == "Yes") {
		//document.getElementById("myV").pause();
		url = liveFeedMap[RPiName];
		document.getElementById("liveImageID").src = url;
	};
	if (val == "No") {
		document.getElementById("liveImageID").src = "";
	};
}

function locationSelection() {
	queryDynamoDB();
	var RPiName = document.getElementById("RPiNameSelect").value;
	var live = document.getElementById("LiveRecorded").value;
	if (live == "Yes") {
		url = liveFeedMap[RPiName];
		document.getElementById("liveImageID").src = url;
	}
}




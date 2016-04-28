function buildCalendar() {
	var RPiName = document.getElementById("RPiNameSelect").value;
    var curr_d = new Date();
    var year = curr_d.getFullYear();
    var yearBeginDate = new Date(year, 0, 1);

    // Getting Epoch
    var curr_epoch = parseInt(curr_d.getTime() / 1000);
    var yearStartEpoch = yearBeginDate.getTime() / 1000;

    console.log(curr_epoch, yearStartEpoch);
    queryDynamoDBForCalendar(yearStartEpoch, curr_epoch, RPiName, 'FOREGROUND');
    
    var live = document.getElementById("LiveRecorded").value;
	if (live == "Yes") {
		url = liveFeedMap[RPiName];
		document.getElementById("liveImageID").src = url;
	}
}


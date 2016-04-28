 
function queryDynamoDBForCalendar(start, end, RPiName, RPiDataType) {
	// Cleaning bar chart area
	var list = document.getElementById("chart_div");
	while (list.hasChildNodes()) {   
	    list.removeChild(list.firstChild);
	}
	document.getElementById("myV").src = "splash.mp4";

	var motionPerDayObject = {};
	var fullData = [];
	var dataLength = 10000;			// Number of records to fetch from DynamoDB

	getDataFromDynamoDB(start, end, RPiName, RPiDataType, table, fullData);

	function getDataFromDynamoDB(start, end, RPiName, RPiDataType, table, fullData) {
		var params = {
			'ExpressionAttributeValues' : {
				':RN': {'S': RPiName},
				':ST': {'N': start.toString()},
				':ET': {'N': end.toString()}
			},
			'ExpressionAttributeNames': {
				'#FIELD': RPiDataType,
			},
			'KeyConditionExpression': 'RASP_NAME = :RN AND START_TIME BETWEEN :ST AND :ET',
			//'Limit': 10,
			'ProjectionExpression': 'RASP_NAME, START_TIME, #FIELD, CLASSIFICATION',
		};

		table.query(params, function(err, data) {
			console.log(err);
			//console.log(data.Items);
			var l = concatData(data.Items, RPiName, RPiDataType);
			if (data.LastEvaluatedKey && l == true) {
				getDataFromDynamoDB(data.LastEvaluatedKey.START_TIME.N, end, RPiName, RPiDataType, table)
			} else {
				doneCalendar(RPiName, RPiDataType);
			}
		});
	}

	function concatData(data, RPiName, RPiDataType) {
		if (fullData.length > 0) {
			data.shift();	// To remove data duplicate due to LastEvaluatedKey
		}
		
		fullData = fullData.concat(data);

		if (fullData.length < dataLength) {
			return true;
		} else {
			return false;
		}
	}

	function doneCalendar(RPiName, RPiDataType) {
		//console.log(RPiName, RPiDataType, fullData);
		for (i=0; i<fullData.length; i++) {
			START_TIME = fullData[i].START_TIME.N;
			//console.log(START_TIME);
			START_TIME = parseInt(START_TIME);
			dataArray = fullData[i][RPiDataType].M.data.L;
			for (j=0; j<dataArray.length; j++) {
				t = START_TIME+j;
				if (Number(dataArray[j].S) > 0) {
					//console.log(t, new Date(t*1000), getDateEpoch(t), dataArray[j].S);
					countMotionPerDay(getDateEpoch(t));
				}
			}
		}
		drawCalendarChart(convertObjectToArray(motionPerDayObject));
	}

	function countMotionPerDay(key) {
		if (key in motionPerDayObject) {
			motionPerDayObject[key]++;
		} else {
			motionPerDayObject[key] = 1;
		}	
	}

	function convertObjectToArray(obj) {
		var motionPerDayArray = [];
		for (key in obj) {
			motionPerDayArray.push([new Date(Number(key)), obj[key]]);
		}
		return motionPerDayArray;
	}
}

function getDateEpoch(d) {
	var n = parseInt(d * 1000);
	var t = new Date(n);
	var year = t.getFullYear(); 
	var month = t.getMonth();
	var day = t.getDate();
	var start = new Date(year, month, day);
	return start.getTime();
}



 
function queryDynamoDB(start, end, RPiName, RPiDataType) {
	// Cleaning bar chart area
	var list = document.getElementById("chart_div");
	while (list.hasChildNodes()) {   
	    list.removeChild(list.firstChild);
	}
	document.getElementById("myV").src = "splash.mp4";

	var fullData = {'FOREGROUND': [], 'FACE_COUNT_DTL': []};
	var dataLength = 10000;			// Number of records to fetch from DynamoDB
	
	var RPiName = document.getElementById("RPiNameSelect").value;
	var startTimestamp = start;	// divide by 1000 to get seconds
	var endTimestamp = end; 
	endTimestamp += 10; 

	// Storing startTimestamp for default video play
	document.getElementById("currentVideoTimestamp").innerHTML = startTimestamp-1;  // minus 1 so that playNextVideo calls Dynamo appropriately

	// Running for every RPiName and Processed data type for this one customer
	for (RPiDataType in fullData) {
		
		function getDataFromDynamoDB(RPiName, RPiDataType, start, end, table, fullData) {
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
				//console.log(data.LastEvaluatedKey);
				var l = concatData(data.Items, RPiName, RPiDataType);
				if (data.LastEvaluatedKey && l == true) {
					getDataFromDynamoDB(RPiName, RPiDataType, data.LastEvaluatedKey.START_TIME.N, end, table)
					//console.log(data.LastEvaluatedKey.START_TIME.N);
					//console.log(data.LastEvaluatedKey.RASP_NAME.S);
				} else {
					done(RPiName, RPiDataType);
				}
			});
		}
		getDataFromDynamoDB(RPiName, RPiDataType, startTimestamp, endTimestamp, table);
	}

	function concatData(data, RPiName, RPiDataType) {
		//console.log(RPiDataType);
		if (fullData[RPiDataType].length > 0) {
			data.shift();	// To remove data duplicate due to LastEvaluatedKey
		}
		
		fullData[RPiDataType] = fullData[RPiDataType].concat(data);

		if (fullData[RPiDataType].length < dataLength) {
			return true;
		} else {
			return false;
		}
	}

	function done(RPiName, RPiDataType) {
		//console.log(RPiName, RPiDataType);
		data = fullData[RPiDataType];
		//console.log(data);
		var dataForLineGraph = [];			// Array for Google charts
		for (i=0; i < data.length; i++) {
			//console.log(data[i].START_TIME.N);
			var videoTimestamp = data[i].START_TIME.N * 1000;

			if (typeof data[i].CLASSIFICATION !== "undefined") {
				var classification = "Neural Net Classifier: " + data[i].CLASSIFICATION.S + "\n";
			} else {
				var classification = "";
			}

			videoTimestamp = parseInt(videoTimestamp) + 1;
			//console.log(videoTimestamp);
			if (typeof data[i][RPiDataType] !== "undefined") {
				dataArray = data[i][RPiDataType].M.data.L;
			} else {
				continue;
			}
			
			//dataArray = data[i][RPiDataType].L;

			for (j=0; j < dataArray.length; j++) {
				var ts = new Date(videoTimestamp);
				var di = Number(dataArray[j].S);
				var tt = "";
				tt = "Data: " + di + "\n" + classification + ts;
				dataForLineGraph.push([ts, di, tt]);
				videoTimestamp += 1000;
			}
			// Adding NULL for break in graph
			videoTimestamp += 500;
			ts = new Date(videoTimestamp);
			dataForLineGraph.push([ts, null, null]);
		}
		//console.log(dataForLineGraph);
		if (dataForLineGraph.length > 0) {
			drawBackgroundColor(RPiName, RPiDataType, dataForLineGraph);
			//console.log(dataForLineGraph);
		}

	}
}



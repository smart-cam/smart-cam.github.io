
function drawCalendarChart(dataForCalendar) {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
    dataTable.addRows(dataForCalendar);

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
        title: "Calendar View of Detected Motion",
        height: 180,
    };

    chart.draw(dataTable, options);
    google.visualization.events.addListener(chart, 'select', selectHandlerCalendar);

    function selectHandlerCalendar() {
        var l = chart.getSelection()[0];
        //console.log(l);
        key = 'row';
        if (key in l) {
            var dateStamp = dataTable.getValue(l.row, 0);
            var start = dateStamp.getTime() / 1000;
            var end = start + 86400;
            buildBar(start, end, 'FOREGROUND');
        } else {
            console.log("Do clean up");
        }
    }
    var curr_d = new Date();
    var year = curr_d.getFullYear();
    var yearBeginDate = new Date(year, 0, 1);

    // Getting Epoch
    var curr_epoch = parseInt(curr_d.getTime() / 1000);
    var yearStartEpoch = yearBeginDate.getTime() / 1000;
    buildBar(yearStartEpoch, curr_epoch,  'FOREGROUND');
}

function buildBar(start, end, RPiDataType) {
    var RPiName = document.getElementById("RPiNameSelect").value;
    queryDynamoDB(start, end, RPiName, RPiDataType);
}



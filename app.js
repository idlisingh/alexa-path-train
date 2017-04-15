var data = require('./weekday')

exports.getNextTrain = getNextTrain;

function getNextTrain(event) {
    var fromStation = "Newport";
    var toStation = event.request.intent.slots.toStation.value;
    var date = getDate(event);
    var schedule = getSchedule(fromStation, toStation);
    var idx = getIndex(fromStation, toStation);
    var trainTime = getTrainTime(date, schedule, idx);

    var result = "Next train to " + toStation + " is in " + trainTime.join(",");
    console.log(result);

	return result
}

function getSchedule(fromStation, toStation) {
    return data.eastBoundHobokenToWTC();
}

function getIndex(fromStation, toStation) {
    return 1;
}

function getTrainTime(date, schedule, idx) {
    var callHour = date.getHours();
    var callMin = date.getMinutes();
    var trainTime = [];
    console.log("Processing for Date: " + date + " Hour: " + callHour + " Minute: " + callMin)
    for (var i = 0; trainTime.length < 2 && i < schedule.length; i++) {
        var value = processTime(schedule[i][idx]);
        var hour = value[0];
        var min = value[1];
        if (callHour <= hour) {
            if (callHour < hour || callMin <= min) {
                var diff = min - callMin;
                diff = diff < 0? diff + 60: diff;
                console.log("Next train in " + schedule[i][idx] + " Hour: " + hour + " Min: " + min);
                trainTime.push(diff);
            }
        }
    }
    return trainTime;
}

function processTime(time) {
    var isPm = time.indexOf("PM") >= 0;
    time = time.replace("AM", "");
    time = time.replace("PM", "");
    var hour = parseInt(time.split(":")[0]);
    var min = parseInt(time.split(":")[1]);
    hour = isPm && hour < 12 ? hour + 12: hour;
    return [hour, min];
}

function getDate(event) {
    var clientDate = new Date(event.request.timestamp);
    var offset = -4.0;
    var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
    var date = new Date(utc + (3600000 * offset));
    return date;
}

function generateResponse(outputText, shouldEndSession, sessionAttributes) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: {
            outputSpeech: {
                type: "PlainText",
                text: outputText
            },
            shouldEndSession: shouldEndSession
        }
    };
}
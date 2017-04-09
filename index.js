exports.handler = (event, context, callback) => {
    if (event.session.new) {
        console.log("New Session")
    }
    console.log(event.request.type)
    
    switch(event.request.type) {
        case "LaunchRequest": 
            console.log("Launch requested")
            context.succeed (
                generateResponse(
                    {},
                    buildSpeechResponse("Which PATH station do you want to go to?", true)
                )
            )
            break;
        case "IntentRequest": 
            switch(event.request.intent.name) {
                case "PathTrain": 
                    var clientDate = new Date(event.request.timestamp)
                    var offset = -4.0
                    var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
                    var date = new Date(utc + (3600000 * offset));
                    var callHour = date.getHours();
                    var callMin = date.getMinutes();
                    
                    var schedule = getWeekdaySchedules();
                    var trainTime = [];
                    console.log("Finding for " + date + " with " + schedule.length);
                    for (var i = 0; trainTime.length < 2 && i < schedule.length; i++) {
                    	var value = schedule[i];
                    	var hour = parseInt(value.split(":")[0]);
                    	var min = parseInt(value.split(":")[1]);
                    	if (callHour <= hour) {
                    		if (callHour < hour || callMin <= min) {
                    			var diff = min - callMin;
                    			diff = diff < 0? diff + 60: diff;
                    			trainTime.push(diff)
                    		}
                    	}
                    }
                    console.log("Next train at: " + trainTime.join(" and "));

                    var station = event.request.intent.slots.station.value
                    console.log(station)
                    context.succeed(
                        generateResponse( 
                            {},
                            buildSpeechResponse("Next Train to " + station + " is in " + trainTime.join(" and ") + " minutes", true)
                        )
                    )
            }
            break;
        case "SessionEndedRequest": 
            console.log("Session end requested")
            break;
        default:
            context.fail("Invalid request")
    }
};

buildSpeechResponse = (outputText, shouldEndSession) => {
    return {
        outputSpeech: {
            type: "PlainText",
            text: outputText
        },
        shouldEndSession: shouldEndSession
    }
}

generateResponse = (sessionAttributes, speechResponse) => {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechResponse
    }
};

function getWeekdaySchedules() {
    return [
        "6:17",
        "6:27",
        "6:37",
        "6:47",
        "6:57",
        "7:07",
        "7:15",
        "7:23",
        "7:31",
        "7:37",
        "7:47",
        "7:54",
        "8:00",
        "8:06",
        "8:12",
        "8:18",
        "8:24",
        "8:30",
        "8:36",
        "8:42",
        "8:48",
        "8:54",
        "9:00",
        "9:06",
        "9:12",
        "9:18",
        "9:24",
        "9:30",
        "9:37",
        "9:49",
        "10:01",
        "10:13",
        "10:24",
        "10:36",
        "10:48",
        "11:00",
        "11:12",
        "11:24",
        "11:36",
        "11:48",
        "12:00",
        "12:12",
        "12:24",
        "12:36",
        "12:48",
        "13:00",
        "13:12",
        "13:24",
        "13:36",
        "13:48",
        "14:00",
        "14:12",
        "14:24",
        "14:36",
        "14:48",
        "15:00",
        "15:12",
        "15:24",
        "15:36",
        "15:48",
        "16:00",
        "16:12",
        "16:20",
        "16:26",
        "16:32",
        "16:43",
        "16:49",
        "16:55",
        "17:01",
        "17:07",
        "17:13",
        "17:19",
        "17:25",
        "17:31",
        "17:37",
        "17:43",
        "17:49",
        "17:55",
        "18:01",
        "18:07",
        "18:13",
        "18:19",
        "18:25",
        "18:37",
        "18:49",
        "19:01",
        "19:12",
        "19:24",
        "19:36",
        "19:48",
        "20:00",
        "20:12",
        "20:24",
        "20:36",
        "20:48",
        "21:00",
        "21:12",
        "21:24",
        "21:36",
        "21:48",
        "22:00",
        "22:14",
        "22:29",
        "22:44",
        "22:59",
        "23:14"
    ]
}

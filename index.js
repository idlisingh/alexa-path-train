exports.handler = handler;
exports.processTime = processTime;

function handler (event, context, callback)  {
    if (event.session.new) {
        console.log("New Session");
    }

    switch(event.request.type) {
        case "LaunchRequest": 
            console.log("Launch requested");
            context.succeed (
                generateResponse(
                    "Which PATH station do you want to go to?", true, {}
                )
            );
            break;
        case "IntentRequest": 
            switch(event.request.intent.name) {
                case "PathTrain": 
                    var fromStation = "Newport";
                    var toStation = event.request.intent.slots.station.value;
                    var date = getDate(event);
                    var schedule = getSchedule(fromStation, toStation);
                    var idx = getIndex(fromStation, toStation);
                    var trainTime = getTrainTime(date, schedule, idx);
                    console.log("Next train to " + toStation + " is in " + trainTime.join(","));
                    
                    context.succeed(
                        generateResponse(
                            "Next Train to " + toStation + " is in " + trainTime.join(" and ") + " minutes",
                            true, {}
                        )
                    );
            }
            break;
        case "SessionEndedRequest": 
            console.log("Session end requested");
            break;
        default:
            context.fail("Invalid request");
    }
}

function getSchedule(fromStation, toStation) {
    return eastBoundHobokenToWTC();
}

function getIndex(fromStation, toStation) {
    return 1;
}

function getTrainTime(date, schedule, idx) {
    var callHour = date.getHours();
    var callMin = date.getMinutes();
    var trainTime = [];
    
    for (var i = 0; trainTime.length < 2 && i < schedule.length; i++) {
        var value = processTime(schedule[i][idx]);
        var hour = value[0];
        var min = value[1];
        if (callHour <= hour) {
            if (callHour < hour || callMin <= min) {
                var diff = min - callMin;
                diff = diff < 0? diff + 60: diff;
                console.log("Next train in " + value);
                trainTime.push(diff);
            }
        }
    }
    return trainTime;
}

function processTime(time) {
    var isPm = time.indexOf("PM");
    time = time.replace("AM", "");
    time = time.replace("PM", "");
    var hour = parseInt(time.split(":")[0]);
    var min = parseInt(time.split(":")[1]);
    hour = isPm? hour + 12: hour;
    return [hour, min];
}

function getDate(event) {
    var clientDate = new Date(event.request.timestamp);
    var offset = -4.0;
    var utc = clientDate.getTime() + (clientDate.getTimezoneOffset() * 60000);
    var date = new Date(utc + (3600000 * offset));
    console.log("Proessing for date: " + date);
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

function eastBoundHobokenToWTC() {
    return [
    //    hoboken,   Newport, ExchangePl,       WTC
        ["6:14AM",  "6:17AM",   "6:20AM",   "6:24AM"],
        ["6:24AM",  "6:27AM",   "6:30AM",   "6:34AM"],
        ["6:34AM",  "6:37AM",   "6:40AM",   "6:44AM"],
        ["6:44AM",  "6:47AM",   "6:50AM",   "6:54AM"],
        ["6:54AM",  "6:57AM",   "7:00AM",   "7:04AM"],
        ["7:04AM",  "7:07AM",   "7:10AM",   "7:14AM"],
        ["7:12AM",  "7:15AM",   "7:18AM",   "7:22AM"],
        ["7:20AM",  "7:23AM",   "7:26AM",   "7:30AM"],
        ["7:28AM",  "7:31AM",   "7:34AM",   "7:38AM"],
        ["7:34AM",  "7:37AM",   "7:40AM",   "7:44AM"],
        ["7:44AM",  "7:47AM",   "7:50AM",   "7:54AM"],
        ["7:51AM",  "7:54AM",   "7:57AM",   "8:01AM"],
        ["7:57AM",  "8:00AM",   "8:03AM",   "8:07AM"],
        ["8:03AM",  "8:06AM",   "8:09AM",   "8:13AM"],
        ["8:09AM",  "8:12AM",   "8:15AM",   "8:19AM"],
        ["8:15AM",  "8:18AM",   "8:21AM",   "8:25AM"],
        ["8:21AM",  "8:24AM",   "8:27AM",   "8:31AM"],
        ["8:27AM",  "8:30AM",   "8:33AM",   "8:37AM"],
        ["8:33AM",  "8:36AM",   "8:39AM",   "8:43AM"],
        ["8:39AM",  "8:42AM",   "8:45AM",   "8:49AM"],
        ["8:45AM",  "8:48AM",   "8:51AM",   "8:55AM"],
        ["8:51AM",  "8:54AM",   "8:57AM",   "9:01AM"],
        ["8:57AM",  "9:00AM",   "9:03AM",   "9:07AM"],
        ["9:03AM",  "9:06AM",   "9:09AM",   "9:13AM"],
        ["9:09AM",  "9:12AM",   "9:15AM",   "9:19AM"],
        ["9:15AM",  "9:18AM",   "9:21AM",   "9:25AM"],
        ["9:21AM",  "9:24AM",   "9:27AM",   "9:31AM"],
        ["9:27AM",  "9:30AM",   "9:33AM",   "9:37AM"],
        ["9:34AM",  "9:37AM",   "9:40AM",   "9:44AM"],
        ["9:46AM",  "9:49AM",   "9:52AM",   "9:56AM"],
        ["9:58AM",  "10:01AM",  "10:04AM",  "10:08AM"],
        ["10:10AM", "10:13AM",  "10:16AM",  "10:20AM"],
        ["10:21AM", "10:24AM",  "10:27AM",  "10:31AM"],
        ["10:33AM", "10:36AM",  "10:39AM",  "10:43AM"],
        ["10:45AM", "10:48AM",  "10:51AM",  "10:55AM"],
        ["10:57AM", "11:00AM",  "11:03AM",  "11:07AM"],
        ["11:09AM", "11:12AM",  "11:15AM",  "11:19AM"],
        ["11:21AM", "11:24AM",  "11:27AM",  "11:31AM"],
        ["11:33AM", "11:36AM",  "11:39AM",  "11:43AM"],
        ["11:45AM", "11:48AM",  "11:51AM",  "11:55AM"],
        ["11:57AM", "12:00PM",  "12:03PM",  "12:07PM"],
        ["12:09PM", "12:12PM",  "12:15PM",  "12:19PM"],
        ["12:21PM", "12:24PM",  "12:27PM",  "12:31PM"],
        ["12:33PM", "12:36PM",  "12:39PM",  "12:43PM"],
        ["12:45PM", "12:48PM",  "12:51PM",  "12:55PM"],
        ["12:57PM", "1:00PM",   "1:03PM",   "1:07PM"],
        ["1:09PM",  "1:12PM",   "1:15PM",   "1:19PM"],
        ["1:21PM",  "1:24PM",   "1:27PM",   "1:31PM"],
        ["1:33PM",  "1:36PM",   "1:39PM",   "1:43PM"],
        ["1:45PM",  "1:48PM",   "1:51PM",   "1:55PM"],
        ["1:57PM",  "2:00PM",   "2:03PM",   "2:07PM"],
        ["2:09PM",  "2:12PM",   "2:15PM",   "2:19PM"],
        ["2:21PM",  "2:24PM",   "2:27PM",   "2:31PM"],
        ["2:33PM",  "2:36PM",   "2:39PM",   "2:43PM"],
        ["2:45PM",  "2:48PM",   "2:51PM",   "2:55PM"],
        ["2:57PM",  "3:00PM",   "3:03PM",   "3:07PM"],
        ["3:09PM",  "3:12PM",   "3:15PM",   "3:19PM"],
        ["3:21PM",  "3:24PM",   "3:27PM",   "3:31PM"],
        ["3:33PM",  "3:36PM",   "3:39PM",   "3:43PM"],
        ["3:45PM",  "3:48PM",   "3:51PM",   "3:55PM"],
        ["3:57PM",  "4:00PM",   "4:03PM",   "4:07PM"],
        ["4:09PM",  "4:12PM",   "4:15PM",   "4:19PM"],
        ["4:17PM",  "4:20PM",   "4:23PM",   "4:27PM"],
        ["4:23PM",  "4:26PM",   "4:29PM",   "4:33PM"],
        ["4:29PM",  "4:32PM",   "4:35PM",   "4:39PM"],
        ["4:40PM",  "4:43PM",   "4:46PM",   "4:50PM"],
        ["4:46PM",  "4:49PM",   "4:52PM",   "4:56PM"],
        ["4:52PM",  "4:55PM",   "4:58PM",   "5:02PM"],
        ["4:58PM",  "5:01PM",   "5:04PM",   "5:08PM"],
        ["5:04PM",  "5:07PM",   "5:10PM",   "5:14PM"],
        ["5:10PM",  "5:13PM",   "5:16PM",   "5:20PM"],
        ["5:16PM",  "5:19PM",   "5:22PM",   "5:26PM"],
        ["5:22PM",  "5:25PM",   "5:28PM",   "5:32PM"],
        ["5:28PM",  "5:31PM",   "5:34PM",   "5:38PM"],
        ["5:34PM",  "5:37PM",   "5:40PM",   "5:44PM"],
        ["5:40PM",  "5:43PM",   "5:46PM",   "5:50PM"],
        ["5:46PM",  "5:49PM",   "5:52PM",   "5:56PM"],
        ["5:52PM",  "5:55PM",   "5:58PM",   "6:02PM"],
        ["5:58PM",  "6:01PM",   "6:04PM",   "6:08PM"],
        ["6:04PM",  "6:07PM",   "6:10PM",   "6:14PM"],
        ["6:10PM",  "6:13PM",   "6:16PM",   "6:20PM"],
        ["6:16PM",  "6:19PM",   "6:22PM",   "6:26PM"],
        ["6:22PM",  "6:25PM",   "6:28PM",   "6:32PM"],
        ["6:34PM",  "6:37PM",   "6:40PM",   "6:44PM"],
        ["6:46PM",  "6:49PM",   "6:52PM",   "6:56PM"],
        ["6:58PM",  "7:01PM",   "7:04PM",   "7:08PM"],
        ["7:09PM",  "7:12PM",   "7:15PM",   "7:19PM"],
        ["7:21PM",  "7:24PM",   "7:27PM",   "7:31PM"],
        ["7:33PM",  "7:36PM",   "7:39PM",   "7:43PM"],
        ["7:45PM",  "7:48PM",   "7:51PM",   "7:55PM"],
        ["7:57PM",  "8:00PM",   "8:03PM",   "8:07PM"],
        ["8:09PM",  "8:12PM",   "8:15PM",   "8:19PM"],
        ["8:21PM",  "8:24PM",   "8:27PM",   "8:31PM"],
        ["8:33PM",  "8:36PM",   "8:39PM",   "8:43PM"],
        ["8:45PM",  "8:48PM",   "8:51PM",   "8:55PM"],
        ["8:57PM",  "9:00PM",   "9:03PM",   "9:07PM"],
        ["9:09PM",  "9:12PM",   "9:15PM",   "9:19PM"],
        ["9:21PM",  "9:24PM",   "9:27PM",   "9:31PM"],
        ["9:33PM",  "9:36PM",   "9:39PM",   "9:43PM"],
        ["9:45PM",  "9:48PM",   "9:51PM",   "9:55PM"],
        ["9:57PM",  "10:00PM",  "10:03PM",  "10:07PM"],
        ["10:11PM", "10:14PM",  "10:17PM",  "10:21PM"],
        ["10:26PM", "10:29PM",  "10:32PM",  "10:36PM"],
        ["10:41PM", "10:44PM",  "10:47PM",  "10:51PM"],
        ["10:56PM", "10:59PM",  "11:02PM",  "11:06PM"],
        ["11:11PM", "11:14PM",  "11:17PM",  "11:21PM"],
    ];
}
var app = require('./app')

exports.handler = handler;

function handler (event, context, callback)  {
    if (event.session.new) {
        console.log("New Session");
    }

    switch(event.request.type) {
        case "LaunchRequest": 
            console.log("Launch requested");
            break;
        case "IntentRequest": 
            switch(event.request.intent.name) {
                case "PathTrainTo": 
				    callback(null, app.getNextTrain(event));
            }
            break;
        case "SessionEndedRequest": 
            console.log("Session end requested");
            break;
        default:
            context.fail("Invalid request");
    }
}
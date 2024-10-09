// var message = {
//     "type": "template",
//     "payload": {
//         "template_type": "table",
//         "text": "Below is the summary of your goals",
//         "columns": [
//             ["Goal Name", "center"],
//             ["Number of Years", "center"],
//             ["Target Amount", "center"],
//             ["SIP Amount", "center"],
//             ["Lumpsum Amount", "center"]
//         ],
//         "table_design": "regular",
//         "elements": []
//     }
// };

// var totalSIP = 0;
// var totalLumpsum = 0;
// if (typeof context.session.BotUserSession.emergencyGoal !== "undefined" ) {
//     totalSIP += parseFloat(context.session.BotUserSession.emergencyGoal.sipAmount);
//     totalLumpsum += parseFloat(context.session.BotUserSession.emergencyGoal.lumpsumAmount);
//     message.payload.elements.push({
//         "Values": ["Emergency Fund", context.session.BotUserSession.emergencyGoal.numberOfYears, context.session.BotUserSession.emergencyGoal.targetAmount, context.session.BotUserSession.emergencyGoal.sipAmount, context.session.BotUserSession.emergencyGoal.lumpsumAmount]
//     });
// }

// if (typeof context.session.BotUserSession.yearlyVacationGoal !== "undefined" ) {
//     totalSIP += parseFloat(context.session.BotUserSession.yearlyVacationGoal.sipAmount);
//     totalLumpsum += parseFloat(context.session.BotUserSession.yearlyVacationGoal.lumpsumAmount);
//     message.payload.elements.push({
//         "Values": ["Yearly Vacation", context.session.BotUserSession.yearlyVacationGoal.numberOfYears, context.session.BotUserSession.yearlyVacationGoal.targetAmount, context.session.BotUserSession.yearlyVacationGoal.sipAmount, context.session.BotUserSession.yearlyVacationGoal.lumpsumAmount]
//     });
// }

// if (typeof context.session.BotUserSession.buyHouseGoal !== "undefined" ) {
//     totalSIP += parseFloat(context.session.BotUserSession.buyHouseGoal.sipAmount);
//     totalLumpsum += parseFloat(context.session.BotUserSession.buyHouseGoal.lumpsumAmount);
//     message.payload.elements.push({
//         "Values": ["Buy House", context.session.BotUserSession.buyHouseGoal.numberOfYears, context.session.BotUserSession.buyHouseGoal.targetAmount, context.session.BotUserSession.buyHouseGoal.sipAmount, context.session.BotUserSession.buyHouseGoal.lumpsumAmount]
//     });
// }

// if (typeof context.session.BotUserSession.saveForWeddingGoal !== "undefined" ) {
//     totalSIP += parseFloat(context.session.BotUserSession.saveForWeddingGoal.sipAmount);
//     totalLumpsum += parseFloat(context.session.BotUserSession.saveForWeddingGoal.lumpsumAmount);
//     message.payload.elements.push({
//         "Values": ["Save for Wedding", context.session.BotUserSession.saveForWeddingGoal.numberOfYears, context.session.BotUserSession.saveForWeddingGoal.targetAmount, context.session.BotUserSession.saveForWeddingGoal.sipAmount, context.session.BotUserSession.saveForWeddingGoal.lumpsumAmount]
//     });
// }

// if (typeof context.session.BotUserSession.otherGoal !== "undefined" ) {
//     totalSIP += parseFloat(context.session.BotUserSession.otherGoal.sipAmount);
//     totalLumpsum += parseFloat(context.session.BotUserSession.otherGoal.lumpsumAmount);
//     message.payload.elements.push({
//         "Values": [context.session.BotUserSession.otherGoal.goalName, context.session.BotUserSession.otherGoal.numberOfYears, context.session.BotUserSession.otherGoal.targetAmount, context.session.BotUserSession.otherGoal.sipAmount, context.session.BotUserSession.otherGoal.lumpsumAmount]
//     });
// }
// message.payload.elements.push({
//           "Values": ["Total monthly SIP & Lumpsum", "", "", totalSIP, totalLumpsum]
//     });
// print(JSON.stringify(message));

var message = {
    "type": "eftemplate",
    "payload": {
        "template_type": "table",
        "text": "Below is the summary of your goals",
        "columns": [
            ["Goal Name", "center"],
            ["Number of Years", "center"],
            ["Target Amount", "center"],
            ["SIP Amount", "center"],
            ["Lumpsum Amount", "center"]
        ],
        "table_design": "regular",
        "elements": []
    }
};

var totalSIP = 0;
var totalLumpsum = 0;

// Iterate through goals in BotUserSession and add them to the message
var goalKeys = ["emergencyGoal", "yearlyVacationGoal", "buyHouseGoal", "saveForWeddingGoal","lumpsum"];
var goalNames = {
    "emergencyGoal": "Emergency Fund",
    "yearlyVacationGoal": "Yearly Vacation",
    "buyHouseGoal": "Buy House",
    "saveForWeddingGoal": "Save For Wedding",
    "lumpsum":"Lumpsum"
};
goalKeys.forEach(function(key) {
    if (context.session.BotUserSession[key] !== undefined) {
        var goal = context.session.BotUserSession[key];
        totalSIP += parseFloat(goal.sipAmount);
        totalLumpsum += parseFloat(goal.lumpsumAmount);
        message.payload.elements.push({
            "Values": [goalNames[key], goal.numberOfYears, goal.targetAmount, goal.sipAmount, goal.lumpsumAmount]
        });
    }
});

var index = 1;
while (context.session.BotUserSession['otherGoal' + index] !== undefined) {
    var otherGoal = context.session.BotUserSession['otherGoal' + index];
    totalSIP += parseFloat(otherGoal.sipAmount);
    totalLumpsum += parseFloat(otherGoal.lumpsumAmount);
    message.payload.elements.push({
        "Values": [otherGoal.goalName, otherGoal.numberOfYears, otherGoal.targetAmount, otherGoal.sipAmount, otherGoal.lumpsumAmount]
    });
    index++;
}


// Add total SIP and Lumpsum to the message
message.payload.elements.push({
    "Values": ["Total monthly SIP & Lumpsum", "", "", totalSIP.toFixed(2), totalLumpsum.toFixed(2)]
});

print(JSON.stringify(message));

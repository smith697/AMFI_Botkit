var botId = "st-af89473f-a6c7-5aa6-a3b7-bed2e9b1d296";
var botName = "Sahil";
const sdk = require("./lib/sdk");
const puppeteer = require("puppeteer");
const fs = require("fs");
const express = require('express');
const path = require('path');
const PORT = 3005;
var app1 = express();


module.exports = {
    botId: botId,
    botName: botName,

    // on_user_message: function (requestId, data, callback) {
    //     if (data.message === "Hi") {
           
    //         // Send a user message back
    //         return sdk.sendUserMessage(data, callback);

    //     } else if (!data.agent_transfer) {
    //         //Forward the message to bot
    //         return sdk.sendBotMessage(data, callback);
    //     } else {
    //         data.message = "Agent Message";
    //         return sdk.sendUserMessage(data, callback);
    //     }
    // },
    on_user_message: async function(requestId, data, callback) {
        if (!data.context.session.BotUserSession.entities) {
            data.context.session.BotUserSession.entities = {};
        }
    
        Object.assign(data.context.session.BotUserSession.entities, data.context.entities);
    
    },    

    on_bot_message: async function (requestId, data, callback) {
        if (data.message === 'downloadsipcardpdf@@@') {
            try {
                console.log("Launching browser...");
                // Launch a headless browser
                const browser = await puppeteer.launch({
                    args: ['--no-sandbox', '--disable-setuid-sandbox'],
                    headless: true,
                    timeout: 60000 // 60 seconds timeout
                });
                console.log("Browser launched.");
                const page = await browser.newPage();

                var goalName ;
                var numberOfYears;
                var targetAmount;
                var sipAmount;
                var lumpsumAmount;
                var totalSIP = 0;
                var totalLumpsum = 0;
                
                const elementHTMLStart = `<!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Goals Table</title>
                        <style>
                            table {
                                width: 60%;
                                border-collapse: collapse;
                                margin: 20px auto;
                            }
                            th, td {
                                border: 1px solid #ddd;
                                padding: 8px;
                                text-align: center;
                            }
                            th {
                                background-color: #f2f2f2;
                            }
                            tr:nth-child(even) {
                                background-color: #f9f9f9;
                            }
                            tr:hover {
                                background-color: #f1f1f1;
                            }
                            caption {
                                font-size: 1.5em;
                                margin: 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <table id="goalsTable">
                            <caption>Goals</caption>
                            <tr>
                                <th>Goal Name</th>
                                <th>Parameter</th>
                                <th>Value</th>
                            </tr>`;

                                    let elementHTMLRows = '';
                                    let elementHTMLEnd = `
                        </table>
                    </body>
                    </html>`;

                var goalKeys = ["emergencyGoal", "yearlyVacationGoal", "buyHouseGoal", "saveForWeddingGoal", "lumpsum"];
                var goalNames = {
                    "emergencyGoal": "Emergency Fund",
                    "yearlyVacationGoal": "Yearly Vacation",
                    "buyHouseGoal": "Buy House",
                    "saveForWeddingGoal": "Save For Wedding",
                    "lumpsum": "Lumpsum"
                };

                goalKeys.forEach(function (key) {
                    if (data.context.session.BotUserSession[key] !== undefined) {
                        var goal = data.context.session.BotUserSession[key];
                        totalSIP += parseFloat(goal.sipAmount);
                        totalLumpsum += parseFloat(goal.lumpsumAmount);

                        let goalName = goalNames[key];
                        let numberOfYears = goal.numberOfYears;
                        let targetAmount = goal.targetAmount;
                        let sipAmount = goal.sipAmount;
                        let lumpsumAmount = goal.lumpsumAmount;

                        elementHTMLRows += `<tr>
                        <td rowspan="4">${goalName}</td>
                            <td>Number of Years</td>
                            <td>${numberOfYears}</td>
                        </tr>
                        <tr>
                            <td>Target Amount</td>
                            <td>${targetAmount}</td>
                        </tr>
                        <tr>
                            <td>SIP Amount</td>
                            <td>${sipAmount}</td>
                        </tr>
                        <tr>
                            <td>Lumpsum Amount</td>
                            <td>${lumpsumAmount}</td>
                        </tr>`;
    
                    }
                });

                const elementHTML = elementHTMLStart + elementHTMLRows + elementHTMLEnd;                

                // Set the content of the page
                console.log("Setting page content...");
                // Set the content of the page with increased timeout
                await page.setContent(elementHTML, { waitUntil: 'load', timeout: 60000 });
                console.log("Page content set.");
                console.log("Generating PDF...");

                // Create a PDF from the page content
                const pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true,
                    timeout: 60000 // 60 seconds timeout
                });
                console.log("PDF generated.");

                // Save the PDF to a file
                fs.writeFileSync('./Sipcard/sample-document.pdf', pdfBuffer);

                // Close the browser
                await browser.close();
                console.log("Browser closed.");

                // Log success
                console.log("PDF generated successfully.");

            } catch (error) {
                console.error("Error generating PDF: ", error);
            }

            app1.use(express.static(path.join(__dirname, 'Sipcard')));
 
            app1.get('/', (req, res) => {res.send('Hello Geek');});

            app1.listen(PORT, () => {
                console.log(`Server Established at PORT->${PORT}`);
            });

           // data.message = "Please click on the link to download SIP Card \n" + "http://localhost:"+PORT+ "/sample-document.pdf";
           data.message = 'Please click on the link to download SIP Card<br><a href="http://localhost:3005/sample-document.pdf">Download PDF</a>';

        }

        return sdk.sendUserMessage(data, callback);
    },
    on_agent_transfer: function (requestId, data, callback) {
        return callback(null, data);
    },
    on_event: function (requestId, data, callback) {
        console.log("on_event -->  Event : ", data.event);
        return callback(null, data);
    },
    on_alert: function (requestId, data, callback) {
        console.log("on_alert -->  : ", data, data.message);
        return sdk.sendAlertMessage(data, callback);
    }

}

var botId = "st-dedc293a-c9cd-55e3-804f-85e979bfcc64";
var botName = "Smita";
var sdk = require("./lib/sdk");



module.exports = {
    botId: botId,
    botName: botName,
    
    on_user_message: async function (requestId, data, callback) {
        if (data.message === "Hi") {
            console.log("user session",JSON.stringify(data.context));


        return sdk.sendUserMessage(data, callback);    

            //const puppeteer = require('puppeteer');
            // async function generatePDFFromHTML(htmlContent, outputPath) {
            //     const browser = await puppeteer.launch();
            //     const page = await browser.newPage();

            //     // Set content to your HTML
            //      page.setContent(htmlContent);

            //     // Generate PDF with default options
            //      page.pdf({ path: outputPath, format: 'A4' });

            //      await browser.close(); }

            // // Example usage
            // const htmlContent = `<html><body><h1>Hello, World!</h1><p>This is an example HTML content.</p></body></html>`;
            // const outputPath = 'C:/Users/ws_htu1184/Desktop/AMFI/BotKit-master(3)/amfi_botkit/docs/temp.pdf';

            // try {
            //     await generatePDFFromHTML(htmlContent, outputPath);
            //     console.log('PDF generated successfully!');
                
            // } catch (error) {
            //     console.error('Error generating PDF:', error);
            // }
        

        } else if (!data.agent_transfer) {
            //Forward the message to bot
            return sdk.sendBotMessage(data, callback);
        } else {
            data.message = "Agent Message";
            return sdk.sendUserMessage(data, callback);
        }
        
    },
    on_bot_message: function (requestId, data, callback) {
        if (data.message === 'hello') {
            data.message = 'The Bot says hello!';
        }
        //Sends back the message to user

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

};



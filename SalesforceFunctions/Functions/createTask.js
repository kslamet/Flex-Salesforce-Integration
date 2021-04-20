exports.handler = function (context, event, callback) {
    // Make sure under Functions Settings tab:
    // "Add my Twilio Credentials (ACCOUNT_SID) and (AUTH_TOKEN) to ENV" is CHECKED
  
    const twilioClient = context.getTwilioClient();
  
    // Pass in From, To, and Url as query parameters
    // Example: https://x.x.x.x/<path>?From=%2b15108675310&To=%2b15108675310&Url=http%3A%2F%2Fdemo.twilio.com%2Fdocs%2Fvoice.xml
    // Note URL encoding above
    // let from = event.From || '+15095550100';
    // If passing in To, make sure to validate, to avoid placing calls to unexpected locations
    // let to = event.To || '+15105550100';
    // let url = event.Url || 'http://demo.twilio.com/docs/voice.xml';
  
    twilioClient.taskrouter.workspaces('WS93a3487eafe87557a9acc270518833e9')
                 .tasks
                 .create({attributes: JSON.stringify({
                    channel:"sfdc-outreach" , type: 'support', sfdcSearchString: "00001027", Name : "Sarah Lee", from: "+18722334717"
                  }), workflowSid: 'WW7d69b454537ce8a1dbd65e1d3c16e0c0'})
                 .then((task) => {
                    console.log(task.sid);
                    return callback(null, 'success');
                 })
                 .catch((error) => {
                    console.log(error);
                    return callback(error);
                  });
      }

  
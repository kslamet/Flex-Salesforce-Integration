exports.handler = function (context, event, callback) {
    // Make sure under Functions Settings tab:
    // "Add my Twilio Credentials (ACCOUNT_SID) and (AUTH_TOKEN) to ENV" is CHECKED
  
    const twilioClient = context.getTwilioClient();
  
    twilioClient.taskrouter.workspaces('WSxxxxxxx')
                 .tasks
                 .create({attributes: JSON.stringify({
                     type: 'support', sfdcSearchString: "<your-case-number or phone number etc>", Name : "Sarah Lee", from: "+<this shows up on Flex widget>"
                  }), workflowSid: 'WWxxxxxxxxxx',
                  taskChannel:'sfdc-outreach'
               })
                 .then((task) => {
                    console.log(task.sid);
                    return callback(null, 'success');
                 });
      }

  
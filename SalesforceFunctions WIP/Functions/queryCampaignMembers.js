// We are using a Salesforce library for Node.js called node-salesforce-connection
// More on this library here - https://github.com/jesperkristensen/node-salesforce-connection

let SalesforceConnection = require("node-salesforce-connection");


exports.handler = function (context, event, callback) {

  // This pulls Twilio credentials into the function
  const twilioClient = context.getTwilioClient();

  // async function is important because we need to wait for:
  // response from Salesforce for login and query, 
  // and Twilio for task creation and Task Id to process if required
  async function queryCampaignMembers() {

  // create an access token with Salesforce using the node-salesforce-connection library
  let sfConn = new SalesforceConnection();

  await sfConn.soapLogin({
    hostname: "login.salesforce.com",
    apiVersion: "39.0",
    username: context.USERNAME,
    password: context.PASSWORD,
  });

  // after connecting, we are querying Salesforce records

  let myMemberQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, Name, Phone from CampaignMember where CampaignId = '" + event.campaignId + "'"));

  console.log(myMemberQuery.totalSize);

  // for each campaign member of specific status, we might want to update 
  for await (let myMember of myMemberQuery.records) {
      var Id = myMember.Id;
      var Name = myMember.Name;
      var PhoneNum = myMember.Phone;
      console.log(Name + ' ' + PhoneNum);
      
      // Create a task for taskChannel sfdc-outreach, for the right workspace an workflowSid
      // Sample code for this available on Taskrouter docs 
      // https://www.twilio.com/docs/taskrouter/api/task?code-sample=code-create-a-task&code-language=Node.js&code-sdk-version=3.x

     
    }
    
// Twilio Function requires return callback
return callback(null, 'success');

}
queryCampaignMembers();

}
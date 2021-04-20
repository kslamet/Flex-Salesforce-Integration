// We are using a Salesforce library for Node.js called node-salesforce-connection
// More on this library here - https://github.com/jesperkristensen/node-salesforce-connection

let SalesforceConnection = require("node-salesforce-connection");

 exports.handler = function (context, event, callback) {

async function queryCase() {
  
  // Get contact ID from Studio Flow parameter
  let conId = event.contactId;
  
  // create an access token with Salesforce using the node-salesforce-connection library
  let sfConn = new SalesforceConnection();

  await sfConn.soapLogin({
    hostname: "login.salesforce.com",
    apiVersion: "39.0",
    username: context.USERNAME,
    password: context.PASSWORD,
  });
  
  var caseId;
  var caseNumber;
  var subject;

  // Query Salesforce contact for the latest case record
  let myCaseQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, CaseNumber, Subject from Case where ContactId = '" + conId + "' order by CaseNumber desc limit 1"));

  console.log(myCaseQuery.totalSize);

  for (let myCase of myCaseQuery.records) {
      caseId = myCase.Id;
      caseNumber = myCase.CaseNumber;
      subject = myCase.Subject;
    }
    
// pass case parameters back to Twilio Studio
return callback(null, {"caseId": caseId, "caseNumber" : caseNumber, "subject": subject});

}
queryCase();

}
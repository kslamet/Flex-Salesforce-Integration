// We are using a Salesforce library for Node.js called node-salesforce-connection
// More on this library here - https://github.com/jesperkristensen/node-salesforce-connection

let SalesforceConnection = require("node-salesforce-connection");

exports.handler = function (context, event, callback) {

  // async function is important because we need to wait for:
  // response from Salesforce for login and query, 
async function createCase() {
  
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

  // create new case parameters to send to SFDC
  let newCase = {
        // SF field API name here
        Subject : "",
        // add other fields as required
    };

// create new case in SFDC
let result = await sfConn.rest("/services/data/v39.0/sobjects/Case",
  {method: "POST", body: newCase});

console.log("New case with ID " + result.id
  + (result.success ? " created successfully." : " failed."));

// get newly created case number from SFDC
let myCaseQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, CaseNumber from Case where Id = '" + result.id + "'"));

var caseNum;

// get case number
for (let myCase of myCaseQuery.records) {
    caseNum = myCase.CaseNumber;
    console.log(caseNum);
      
  }

// pass case number back to SFDC
return callback(null, {"param" : caseNum});

}
createCase();

}
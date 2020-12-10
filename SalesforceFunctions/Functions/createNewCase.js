let SalesforceConnection = require("node-salesforce-connection");

exports.handler = function (context, event, callback) {

async function createCase() {
  
  let conId = event.contactId;
  let sfConn = new SalesforceConnection();

  await sfConn.soapLogin({
    hostname: "login.salesforce.com",
    apiVersion: "39.0",
    username: context.USERNAME,
    password: context.PASSWORD,
  });

  let newCase = {

        Subject : "Claims inquiry",
        Status : "New",
        Priority : "High",
        ContactId : conId,
        Origin : "Phone",
    };

let result = await sfConn.rest("/services/data/v39.0/sobjects/Case",
  {method: "POST", body: newCase});

console.log("New case with ID " + result.id
  + (result.success ? " created successfully." : " failed."));

let myCaseQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, CaseNumber from Case where Id = '" + result.id + "'"));

var caseNum;

for (let myCase of myCaseQuery.records) {
    caseNum = myCase.CaseNumber;
    console.log(caseNum);
      
  }

return callback(null, {"param" : caseNum});

}
createCase();

}
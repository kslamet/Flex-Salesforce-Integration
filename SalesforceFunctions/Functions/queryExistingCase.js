let SalesforceConnection = require("node-salesforce-connection");

 exports.handler = function (context, event, callback) {

async function queryCase() {

  let sfConn = new SalesforceConnection();
  let conId = event.contactId;

  await sfConn.soapLogin({
    hostname: "login.salesforce.com",
    apiVersion: "39.0",
    username: context.USERNAME,
    password: context.PASSWORD,
  });
  
  var caseId;
  var caseNumber;
  var subject;

  let myCaseQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, CaseNumber, Subject from Case where ContactId = '" + conId + "' order by CaseNumber desc limit 1"));

  console.log(myCaseQuery.totalSize);

  for (let myCase of myCaseQuery.records) {
      caseId = myCase.Id;
      caseNumber = myCase.CaseNumber;
      subject = myCase.Subject;
    }
    

return callback(null, {"caseId": caseId, "caseNumber" : caseNumber, "subject": subject});

}
queryCase();

}
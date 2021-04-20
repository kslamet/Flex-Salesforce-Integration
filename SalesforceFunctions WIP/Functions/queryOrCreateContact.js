// We are using a Salesforce library for Node.js called node-salesforce-connection
// More on this library here - https://github.com/jesperkristensen/node-salesforce-connection

let SalesforceConnection = require("node-salesforce-connection");

 exports.handler = function (context, event, callback) {

async function queryContact() {

  // Get phone number from Twilio Studio
  let phoneNum = event.phoneNum;

  var contactId;
  var firstName;
  var lastName;
  var exist = "no";

  // create an access token with Salesforce using the node-salesforce-connection library
  let sfConn = new SalesforceConnection();

  await sfConn.soapLogin({
    hostname: "login.salesforce.com",
    apiVersion: "39.0",
    username: context.USERNAME,
    password: context.PASSWORD,
  });

  // Query Salesforce for the contact record of the phone number
  let myContactQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, FirstName, Phone from Contact where Phone = '" + phoneNum + "'"));

  console.log(myContactQuery.totalSize);

  if (myContactQuery.totalSize > 0) {
  
  // If contact exists, store contact record parameters, and update exist flag to "yes"
  for (let myContact of myContactQuery.records) {
      contactId = myContact.Id;
      firstName = myContact.FirstName;
      lastName = myContact.LastName;
      phoneNum = myContact.Phone;
      exist = "yes";
      console.log(firstName);
      console.log(phoneNum);
    }}
    // If Contact does not exist, create a new contact record
    else {
          firstName = "Unknown";
          lastName = "Customer";
          phoneNum = event.phoneNum;
      
          let newContact = {
              FirstName : firstName,
              LastName : lastName,
              Phone: phoneNum
          };
          // Create new contact called "Unknown Customer"
          let result = await sfConn.rest("/services/data/v39.0/sobjects/Contact",
              {method: "POST", body: newContact});

          console.log("New contact with ID " + result.id
                + (result.success ? " created successfully." : " failed."));
          // Store the contact ID
          contactId = result.id;
    }
// Pass parameters back to Twilio Studio
return callback(null, {"contactId": contactId, "firstName" : firstName, "lastName": lastName, "phoneNum" : phoneNum, "exist" : exist});

}
queryContact();

}
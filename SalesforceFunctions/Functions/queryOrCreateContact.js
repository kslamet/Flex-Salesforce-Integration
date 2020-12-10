let SalesforceConnection = require("node-salesforce-connection");

 exports.handler = function (context, event, callback) {

async function queryContact() {

  let sfConn = new SalesforceConnection();
  let phoneNum = event.phoneNum;

  var contactId;
  var firstName;
  var lastName;
  var exist = "no";

  await sfConn.soapLogin({
    hostname: "login.salesforce.com",
    apiVersion: "39.0",
    username: context.USERNAME,
    password: context.PASSWORD,
  });

  let myContactQuery = await sfConn.rest("/services/data/v39.0/query/?q="
  + encodeURIComponent("select Id, FirstName, Phone from Contact where Phone = '" + phoneNum + "'"));

  console.log(myContactQuery.totalSize);

  if (myContactQuery.totalSize > 0) {

  for (let myContact of myContactQuery.records) {
      contactId = myContact.Id;
      firstName = myContact.FirstName;
      lastName = myContact.LastName;
      phoneNum = myContact.Phone;
      exist = "yes";
      console.log(firstName);
      console.log(phoneNum);
    }}
    else {
          firstName = "Unknown";
          LastName = "Customer";
          phoneNum = event.phoneNum;
      
          let newContact = {
              FirstName : "Unknown",
              LastName : "Customer",
              Phone: phoneNum
          };

          let result = await sfConn.rest("/services/data/v39.0/sobjects/Contact",
              {method: "POST", body: newContact});

          console.log("New contact with ID " + result.id
                + (result.success ? " created successfully." : " failed."));
          
          contactId = result.id;
    }
return callback(null, {"contactId": contactId, "firstName" : firstName, "lastName": lastName, "phoneNum" : phoneNum, "exist" : exist});

}
queryContact();

}
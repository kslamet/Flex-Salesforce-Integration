# Flex-SFDC-Integration

This repo contains everything needed to replicate an integration between Twilio Flex and Salesforce in voice IVR scenario. A recorded video of this is available on the following [link] (https://drive.google.com/file/d/1OQblG6YlE6r6I45NtIEzRc5dfsqSc5ij/view?usp=sharing). The scenario slide is available on this [link] (https://docs.google.com/presentation/d/1W4iA7saxJiU2aAHzrc2mtk0aW9EfYJ1XFgcUEdepMFk/edit?usp=sharing).

The illustration of the scenario is as follows:
<img src="https://aqua-cichlid-2234.twil.io/assets/Scenario.png/>

The demo shows how our customer connects with our fictional insurance company, starting as an unknown customer submitting a new case, calling back in to inquire on existing case, and finally calling in about a totally different case.

The demo outline is: 

1. Unknown customer calls in for the first time, and a temporary contact record is created. the newly created "Unknown User" is shown during screenpop. (Studio / IVR / Functions)
2. After updating the contact record, create a new case for the contact. Hangup the first call. (Flex Salesforce Widget)
3. Customer makes a second call, to which a valid contact record is found, and the customer is asked if he is inquiring about the latest case (Studio / IVR / Functions)
4. If yes, call is connected to agent and screenpop will open the latest case (Data Dip into Salesforce and screenpop case record)
5. If no, IVR will highlight types of issues, and on IVR selection a case will be created specific to the issue (create case from IVR selection)

## 🛠 Setup

This section is about how to setup your Salesforce Developer Edition and Twilio account.

### 1. Sign up for Twilio Flex

If you don't already have a Twilio account go ahead and create a free account [here](https://www.twilio.com/try-twilio). Once you've signed up for your Twilio account it's time to create a Flex project. Just follow the instructions found [here](https://www.twilio.com/docs/flex/tutorials/setup) to get a Flex project up and running. 

### 2. Allow outbound calling in Flex

In order to call our customer we need to allow Flex to make outbound calls. Follow along with [this blog](https://www.twilio.com/blog/flex-programmable-dialpad-outbound-calling) to set this up

### 3.Sign up for Salesforce Developer Org

Go ahead and register with Salesforce [here](https://developer.salesforce.com/signup). Fill out the form and verify the email address to have your developer org activated. Note that if there is no login / user activity for 12 months, the Salesforce Developer Org will become inactive and will eventually be deleted.

Also, create a domain name on your Salesforce Developer Edition so that we can use it in step 4. The steps to creating the domain name can be found [here] (https://help.salesforce.com/articleView?id=domain_name_define.htm&type=5). Domain name provisioning usually takes a few minutes, but can be up to 24 hours.

### 4. Integrate Flex with Salesforce

In Twilio:

We've put together a guide on how to connect Twilio Flex into your Salesforce Developer Org which you can find [here](https://www.twilio.com/docs/flex/admin-guide/integrations/salesforce). Go ahead and follow the steps in this guide. You will likely be using the Lightning

When configuring the integration in Twilio Flex make sure to set the settings as follows:

<img src="https://aqua-cichlid-2234.twil.io/assets/integration_settings.png"/>

(Hint: You will need the url of your `Salesforce Domain` which you specified in Step 3).

(Optional) In the XML file, we suggest to have softphone height to be 700 pixels to have slightly more Flex real estate in the Salesforce widget.

### 5. Setting up the Salesforce Contact and Case Record

The scenario will start from a new unknown customer dialing into the hotline. Therefore, we do not need a contact or case record to be pre-created.

### 6. Reset Salesforce Security Token

For Twilio Functions to authenticate with Salesforce, a security token is required. You can follow this [guide] (https://help.salesforce.com/articleView?id=user_security_token.htm&type=5) to reset your security token, and you will receive the token via email. This security token is required in the environment variables later on.

### 7. Upload Twilio Functions

We will be using the Twilio CLI to deploy our Twilio Functions to our account (as described [here](https://www.twilio.com/blog/the-new-way-to-create-develop-and-deploy-twilio-functions)). Before we do this we need to setup our enviornment variables in a new `SalesforceFunctions/.env` file in the the `/SalesforceFunctions` directory, similarly to the `SalesforceFunctions/.example.env` file. 

The variables are: 

| Env Name  | Description |
| ------------- | ------------- |
| USERNAME | Your Salesforce Username which you registered for the Salesforce Developer Account.  |
| PASSWORD |  Important: This is NOT just your password. This is the concatenated string of your password followed by Salesforce Token. If you don't have your Salesforce token, you can reset it per [this] (https://help.salesforce.com/articleView?id=user_security_token.htm&type=5) instructions. |

With that we can now deploy our functions. First make sure you are logged into the right account. Either run `twilio login` if you haven't logged into the account before or run `twilio profiles:list` and make sure if your active account is the account you want to use. If you are not using the right account you can switch account by running `twilio profiles:use <your profile name>`.

Next make sure you're in the `/SalesforceFunctions` folder and run `twilio serverless:deploy`. Now your Functions should be uploaded to your account!


### 8. Setup Studio Flow

We will be importing the JSON version of the Studio flow from the `SFDC-FlexFlow.json` file as described [here](https://www.twilio.com/docs/studio/user-guide#importing-and-exporting-flows). Once you have imported the studio flow there are 3 widgets that need to be updated:


| Widget Name  | Description |
| ------------- | ------------- |
| queryOrCreateContact | The function to be used isn't set yet. make sure the widget is pointing at your `/queryOrCreateContact` function of the `SalesforceFunctions` Service  |
| getLatestCase | The function to be used isn't set yet. make sure the widget is pointing at your `/queryExistingCase` function of the `SalesforceFunctions` Service  |
| newCaseClaims | The function to be used isn't set yet. make sure the widget is pointing at your `/queryExistingCase` function of the `SalesforceFunctions` Service  |

### 9. Connect a number to your Studio Flow

Similar to [here](https://www.twilio.com/docs/studio/tutorials/how-to-forward-calls#connect-the-flow-to-a-number) we will now connect a number in your account ( which you can find [here](https://www.twilio.com/console/phone-numbers/incoming)) with your Studio flow. Make sure to connect your number to the studio flow for incoming calls.

## Demo Time!

At this point you should be all set. log into your Salesforce account, select the Service Console app, open the flex plugin in the CTI adapter and mark yourself as online. We will be making 3 inbound phone calls to Flex. 
The first inbound call to the phone number will directly connect to an agent, and a new 'Unknown Customer' record will be created and screenpopped. Update the customer's name, and create a new case linked to the customer record. Hangup the call. IMPORTANT NOTE: it takes some time for the temporary contact record to be created in Salesforce and to be searchable on Salesforce Global Search. Take time to explain the contact record creation happening behind the scene before picking up the task. 
The second inbound call will then do a data dip, and ask the customer if the call is about the previously created case. Click 1 (yes), and the call will connect to Flex agent, and the previously created case will be screenpopped.
The third inbound call will again ask about the previously created case. Click 2 (no), and after the cue, click 4 for claims related case (feel free to edit the created case details as required). A new case will be created, and customer will be connected to agent relating to the newly created case from IVR.

Additionally, the Flex Agent is also able to make outbound call back to the customer (for example: if the call dropped) by using click to dial on the customer phone number on Salesforce.

## Resources

Recorded video of the demo: [recording link] (https://drive.google.com/file/d/1OQblG6YlE6r6I45NtIEzRc5dfsqSc5ij/view?usp=sharing)
Scenario slide: [slide link] (https://docs.google.com/presentation/d/1W4iA7saxJiU2aAHzrc2mtk0aW9EfYJ1XFgcUEdepMFk/edit?usp=sharing)

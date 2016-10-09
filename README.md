# Monzo for Alexa
This project provides an Alexa Skill for the Monzo card/bank - It allows users to query their bank balance and spending history simply and easily with just their voice.

# Setting up a development environment
- Clone the repository
- Run `npm install`
- Zip everything in the folder (including the `node_modules` folder!)
- Set up a AWS Lambda function, and choose to upload the code as a ZIP.
- Go to the [Alexa Developer Site](https://developer.amazon.com/edw/home.html) and create a new **Alexa Skills Kit** skill.
- Use whatever you like for the application name and invocation name
- Set up the Interaction model using the schema defined in the `alexa_schema` folder
- On the configuration page
    - Set the service endpoint to use the ARN from the Lambda function you set up above
    - Enable **Account Linking**
    - Set the `Authorization URL` to `https://auth.getmondo.co.uk/`
    - Set the client ID to the ID given by [Monzo's OAuth client registration](https://developers.getmondo.co.uk/apps/home)
    - Set `Authorization Grant Type` to `Auth Code`
    - Set `Access Token URI` to `https://api.monzo.com/oauth2/token`
    - Set Client Secret to the secret given by [Monzo's OAuth client registration](https://developers.getmondo.co.uk/apps/home)
- Enable the skill for testing on your own Alexa
- Develop!

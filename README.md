# Monzo for Alexa [![CircleCI](https://circleci.com/gh/Geit/alexa-monzo.svg?style=svg)](https://circleci.com/gh/Geit/alexa-monzo)
This project provides an Alexa Skill for the Monzo card/bank - It allows users to query their bank balance and spending history simply and easily with just their voice.

[![Demo of Monzo Skill for Alexa](http://img.youtube.com/vi/_CUqqCOAV6s/0.jpg)](http://www.youtube.com/watch?v=_CUqqCOAV6s)

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
    - Copy one of the `Redirect URLs` into the `Redirect URI` of your Monzo OAuth Client
    - Set `Authorization Grant Type` to `Auth Code`
    - Set `Access Token URI` to `https://api.monzo.com/oauth2/token`
    - Set Client Secret to the secret given by [Monzo's OAuth client registration](https://developers.getmondo.co.uk/apps/home)
- Enable the skill for testing on your own Alexa
- Develop!

# Troubleshooting
If you're having difficulty linking your account to Alexa using the Alexa app on *iPhone*, try instead using https://alexa.amazon.co.uk/ through a desktop or mobile browser (Avoiding any built-in WebViews if possible).

If you recieve `Unable to import module 'module'` in your CloudWatch logs after uploading the zip to AWS Lambda, then the structure of your zip might be in a format that Lambda doesn't expect. Your zip must not contain just a folder at its top level, it must contain index.js on the top-level.

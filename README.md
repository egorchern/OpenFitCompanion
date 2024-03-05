# OpenFitCompanion
Open-source full-stack application to synchronize with health data provider to accelerate user's fitness journey.
## Deployment
1. Register for AWS: https://aws.amazon.com/resources/create-account/
2. Set up billing: https://us-east-1.console.aws.amazon.com/billing/home#/bills
3. Deploy CloudFormation Stack via Web Console. 
    - Go to: https://us-east-1.console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks
    - Create Stack
    - With new resources
    - Upload a template file
    - Choose file - cloudformation.yml
    - Stack name: OpenFitCompanion
    - Parameters: 
        - External: Go to Respective websites and follow instructions to get API tokens: OpenAI API token, Oura personal access token, Withings client id and secret
        - Internal: Personal Secret: any string, go to any online password generator, Vapid: https://github.com/web-push-libs/web-push?tab=readme-ov-file#command-line
4. Go to Amplify (https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/). 
    - Go to openFitCompanion
    - Click on link under "Domain"
    - Fill in API SECRET field with Personal Secret you generated for cloudformation parameter
    - Allow notifications to enable push notifications
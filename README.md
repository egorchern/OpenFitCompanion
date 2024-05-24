# OpenFitCompanion
Open-source full-stack application to synchronize with health data providers and provide insights using OpenAI GPT API to accelerate user's fitness journey.
## Structure
### High-Level
![image](https://github.com/egorchern/OpenFitCompanion/assets/46675707/d63a190e-e9bb-44b3-8e26-b669468f4b22)
### Back-end
![image](https://github.com/egorchern/OpenFitCompanion/assets/46675707/877daabc-8ed7-4c2d-86fc-2664fad1bf56)
### Front-end
![image](https://github.com/egorchern/OpenFitCompanion/assets/46675707/6005b837-e478-42dc-9ef3-9dead8a7ab19)
## Results
![image](https://github.com/egorchern/OpenFitCompanion/assets/46675707/11a960e9-2a84-4a66-bcd4-99f5e1271d96)
![image](https://github.com/egorchern/OpenFitCompanion/assets/46675707/b7a67470-36d9-40d4-bad4-454abc23fd95)
![image](https://github.com/egorchern/OpenFitCompanion/assets/46675707/b7446175-d477-4c8c-b405-9633a9b64f53)

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
4. Run upload_code.ps1 command
5. Upload Lambda function code. Go to each Lambda function. Upload appropriate .zip file from temp folder
6. Go to Amplify (https://us-east-1.console.aws.amazon.com/amplify/home?region=us-east-1#/). 
    - Go to openFitCompanion
    - Click on link under "Domain"
    - Fill in API SECRET field with Personal Secret you generated for cloudformation parameter
    - Allow notifications to enable push notifications

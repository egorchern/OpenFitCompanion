import {SNSClient, PublishCommand} from "@aws-sdk/client-sns"
import config from "./config.json" assert { type: "json" }
import { getAdapter } from "common/adapter.mjs"
import { Provider } from "common/types.mjs"

export const handler = async (event: any) => {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    console.log(event)
    const method = event?.requestContext?.http?.method
    if (!method){
        return {
            statusCode: 400
        }
    }
    if (method === "GET"){
        const challenge = event?.queryStringParameters?.challenge
        if (!challenge){
            return {
                statusCode: 400
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                challenge: challenge
            })
        }

    }
    else if (method === "POST"){
        const obj = getAdapter(Provider.Oura).processPOST(event.body);
        const client = new SNSClient({

        })
        const command = new PublishCommand({
            TopicArn: config.processingArn,
            Message: JSON.stringify(obj)
        })
        // Push to sns for processing
        const response = await client.send(command)
        return {
            statusCode: 200
        }
    } 
    else {
        return {
            statusCode: 400
        }
    }
    
  };
  
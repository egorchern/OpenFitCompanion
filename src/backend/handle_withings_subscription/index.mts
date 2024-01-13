import {SNSClient, PublishCommand} from "@aws-sdk/client-sns"
import config from "./config.json" assert { type: "json" }
import { getAdapter } from "common/adapter.mjs"
import { Provider } from "common/types.mjs"

export const handler = async (event:any, context:any) =>  {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    const body = event.body;
    if (!body){
        return {
            statusCode: 400
        }
    }
    const obj = getAdapter(Provider.Withings).processPOST(body)
    const command = new PublishCommand({
        TopicArn: config.processingArn,
        Message: JSON.stringify(obj)
    })
    const client = new SNSClient({

    })
    // Push to sns for processing
    const response = await client.send(command)
    return {
        statusCode: 200
    }
    
}

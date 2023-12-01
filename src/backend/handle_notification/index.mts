import {SNSClient, PublishCommand} from "@aws-sdk/client-sns"
import config from "./config.json" assert { type: "json" }
const handle_notification = async (text: string) => {
    const client = new SNSClient({

    })
    const command = new PublishCommand({
        TopicArn: config.processingArn,
        Message: text
    })
    // Push to sns for processing
    const response = await client.send(command)
}
export const handler = async (event:any, context:any) =>  {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    const body = event.body;
    const buff =  Buffer.from(body, 'base64');
    const text = buff.toString('utf8');
    await handle_notification(text)
    return {
        statusCode: 200
    }
    
}

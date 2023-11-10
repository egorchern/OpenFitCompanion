import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand  } from "@aws-sdk/lib-dynamodb";
import config from "../config.json" assert {type: "json"};
import { randomUUID } from "crypto";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const handler = async (event:any, context:any) =>  {
    event = JSON.parse(event)
    let data = event.body
    data.Id = randomUUID()
    const command = new PutCommand({
        TableName: config.Table_name,
        Item: data
    });
    const response  = await ddbDocClient.send(command)
    
}
if (process.env.NODE_ENV === "dev"){
    handler(JSON.stringify({
        body:{
            date: Date.now()
        }
        
    }), {})
}

import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { getTimestamp } from "../../utilities.mjs";
import config from "./config.json" assert { type: "json" }
import { ActivityData, SleepData } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const insertPushSubscription = async (data: PushSubscription) => {
    let copy: any = structuredClone(data)
    Object.keys(copy).forEach((key: any) => copy[key] === undefined ? delete copy[key] : {});
    copy.CreatedAt = getTimestamp();
    copy.UserID = 1
    copy.Type = "pushSubscription"
    const putTokenCommand = new PutCommand({
        TableName: config.TableName,
        Item: copy,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

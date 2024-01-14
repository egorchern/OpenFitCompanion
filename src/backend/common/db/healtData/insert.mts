import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { getTimestamp } from "../../utilities.mjs";
import config from "./config.json" assert { type: "json" }
import { HealthDataType } from "./types.mjs";
import { ActivityData, SleepData } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const insertHealthData = async (date: string, data: ActivityData | SleepData) => {
    let copy: any = structuredClone(data)
    Object.keys(copy).forEach((key: any) => copy[key] === undefined ? delete copy[key] : {});
    copy.Provider = data.provider
    copy.CreatedAt = getTimestamp();
    copy.Date = date
    copy.Type = `${data.type}_${data.provider}`
    
    const putTokenCommand = new PutCommand({
        TableName: config.healthDataTableName,
        Item: copy,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

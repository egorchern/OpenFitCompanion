import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { getTimestamp } from "../../utilities.mjs";
import config from "./config.json" assert { type: "json" }
import { HealthDataType } from "./types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const insertHealthData = async (date: string, type: HealthDataType, provider: string, data:any) => {
    Object.keys(data).forEach(key => data[key] === undefined ? delete data[key] : {});
    data.Provider = provider
    data.CreatedAt = getTimestamp();
    data.Date = date
    data.Type = type
    
    const putTokenCommand = new PutCommand({
        TableName: config.healthDataTableName,
        Item: data,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

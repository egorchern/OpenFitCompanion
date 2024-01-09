import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { getTimestamp } from "../../utilities.mjs";
import config from "./config.json" assert { type: "json" }
import { GoalType } from "./types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const insertGoal = async (goalType: GoalType, value: Number) => {
    
    let data: any = {
        Type: goalType,
        Value: value,
        CreatedAt: getTimestamp()
    }

    
    const putTokenCommand = new PutCommand({
        TableName: config.tableName,
        Item: data,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

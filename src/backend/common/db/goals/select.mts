import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { Goal, GoalType } from "./types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getGoal = async (goalType: GoalType): Promise<Goal> => {
    const command = new GetCommand({
        TableName: config.tableName,
        Key: {
           Type: goalType
        }
    })
    const response = await ddbDocClient.send(command)
    
    return response.Item as Goal
}

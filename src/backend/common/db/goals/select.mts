import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { Goal, GoalType } from "./types.mjs";
import { HealthDataType } from "../healtData/types.mjs";
import { HealthData } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getGoal = async (type: HealthDataType) => {
    const command = new GetCommand({
        TableName: config.tableName,
        Key: {
           Type: type
        }
    })
    const response = await ddbDocClient.send(command)
    console.log(response)
    return response.Item as HealthData
}

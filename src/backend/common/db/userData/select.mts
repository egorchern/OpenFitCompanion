import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { HealthData, Provider } from "../../types.mjs";
import { UserDataType } from "./types.mjs";
import { toShortISODate } from "../../utilities.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev") {
    // dbConfig.endpoint = config.LocalDbEndpoint
    dbConfig.region = "us-east-1"
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);
export const selectAIFeedback = async (date: Date) => {
    const type = `AI_DAYFEEDBACK_${toShortISODate(date)}`
    const command = new GetCommand({
        TableName: config.TableName,
        Key: {
            UserID: 1,
            Type: type
        },
        ConsistentRead: true
        
    })

    const response = await ddbDocClient.send(command)
    return response.Item
}

export const selectAIWorkout = async (date: Date) => {
    const type = `AI_WORKOUT_${toShortISODate(date)}`
    const command = new GetCommand({
        TableName: config.TableName,
        Key: {
            UserID: 1,
            Type: type
        },
        ConsistentRead: true
        
    })

    const response = await ddbDocClient.send(command)
    return response.Item
}

export const selectUserData = async (type: UserDataType) => {
    const command = new GetCommand({
        TableName: config.TableName,
        Key: {
            UserID: 1,
            Type: type
        },
        ConsistentRead: true
        
    })

    const response = await ddbDocClient.send(command)


    return response.Item
}

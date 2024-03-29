import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { getTimestamp } from "../../utilities.mjs";
import config from "./config.json" assert { type: "json" }
import { ActivityData, SleepData } from "../../types.mjs";
import { UserDataType } from "./types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    // dbConfig.endpoint = config.LocalDbEndpoint
    dbConfig.region = "us-east-1"
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);
export const insertAIFeedback = async (data: any) => {
    let copy: any = structuredClone(data)
    Object.keys(copy).forEach((key: any) => copy[key] === undefined ? delete copy[key] : {});
    copy.CreatedAt = getTimestamp();
    copy.UserID = 1
    copy.Type = `AI_DAYFEEDBACK_${copy.date}`
    const putTokenCommand = new PutCommand({
        TableName: config.TableName,
        Item: copy,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

export const insertAIWorkout = async (data: any) => {
    let copy: any = structuredClone(data)
    Object.keys(copy).forEach((key: any) => copy[key] === undefined ? delete copy[key] : {});
    copy.CreatedAt = getTimestamp();
    copy.UserID = 1
    copy.Type = `AI_WORKOUT_${copy.date}`
    const putTokenCommand = new PutCommand({
        TableName: config.TableName,
        Item: copy,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

export const insertUserData = async (data: any, type: UserDataType) => {
    let copy: any = structuredClone(data)
    Object.keys(copy).forEach((key: any) => copy[key] === undefined ? delete copy[key] : {});
    copy.CreatedAt = getTimestamp();
    copy.UserID = 1
    copy.Type = type
    const putTokenCommand = new PutCommand({
        TableName: config.TableName,
        Item: copy,
        
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { HealthData, Provider } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev") {
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const selectPushSubscription = async (): Promise<PushSubscription> => {
    const command = new GetCommand({
        TableName: config.TableName,
        Key: {
            UserID: 1,
            Type: "pushSubscription"
        },
        
    })

    const response = await ddbDocClient.send(command)


    return response.Item as PushSubscription
}

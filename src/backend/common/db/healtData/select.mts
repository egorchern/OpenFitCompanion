import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { HealthDataType } from "./types.mjs";
import { HealthData, Provider } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev") {
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const selectHealthData = async (date: string, type: HealthDataType, provider: Provider, consistentRead: boolean): Promise<HealthData> => {
    const command = new GetCommand({
        TableName: config.healthDataTableName,
        Key: {
            Type: `${type}_${provider}`,
            Date: date
        },
        ConsistentRead: consistentRead
    })

    const response = await ddbDocClient.send(command)


    return response.Item as HealthData
}

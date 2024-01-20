import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { HealthDataType } from "./types.mjs";
import { HealthData, Provider } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev") {
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const scanHealthData = async (): Promise<[HealthData]> => {
    const command = new ScanCommand({
        TableName: config.healthDataTableName,
        
    })

    const response = await ddbDocClient.send(command)
    return response.Items as [HealthData]

    
}

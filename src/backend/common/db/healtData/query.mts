import { DynamoDBClient, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
import { HealthDataType } from "./types.mjs";
import { HealthData, Provider } from "../../types.mjs";
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev") {
    // dbConfig.endpoint = config.LocalDbEndpoint
    dbConfig.region = config.region
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const queryHealthData = async (startDate: string, endDate: string, type: HealthDataType, provider: Provider): Promise<[HealthData]> => {
    const command = new QueryCommand({
        TableName: config.healthDataTableName,
        ExpressionAttributeValues: {
            ":type": `${type}_${provider}`,
            ":startdate": startDate,
            ":enddate": endDate
        },
        ExpressionAttributeNames: {
            "#t": "Type",
            "#d": "Date"
        },
        KeyConditionExpression: `#t = :type AND #d BETWEEN :startdate AND :enddate`
    })

    const response = await ddbDocClient.send(command)
    return response.Items as [HealthData]

    
}

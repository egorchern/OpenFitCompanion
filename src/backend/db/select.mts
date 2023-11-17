import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand} from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getRefreshToken = async () => {
    const command = new GetCommand({
        TableName: config.tokens_table_name,
        Key: {
           TokenType: "refreshToken"
        }
    })
    const response = await ddbDocClient.send(command)
    console.log(response)
    return response.Item?.Value
}
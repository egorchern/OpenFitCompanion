import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import config from "./config.json" assert { type: "json" }
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Persist oauth2 tokens in a db
export const PutTokens = async (refreshToken: string, accessToken: string, userId: string) => {
    const putRefreshTokenCommand = new PutCommand({
        TableName: config.tokens_table_name,
        Item: {
            TokenType: "refreshToken",
            Value: refreshToken,
        }
    })
    const putAccessTokenCommand = new PutCommand({
        TableName: config.tokens_table_name,
        Item: {
            TokenType: "accessToken",
            Value: accessToken,
        }
    })
    const putUserId = new PutCommand({
        TableName: config.tokens_table_name,
        Item: {
            TokenType : "userId",
            Value: userId,
        }
    })
    const responses = await Promise.all([ddbDocClient.send(putRefreshTokenCommand), ddbDocClient.send(putAccessTokenCommand), ddbDocClient.send(putUserId)])
    console.log(responses)
}

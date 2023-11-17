import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand} from "@aws-sdk/lib-dynamodb";
import { tokenType } from "./types.mjs";
import config from "./config.json" assert { type: "json" }
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const putToken = async (tokenType: tokenType, tokenValue: string) => {
    const putTokenCommand = new PutCommand({
        TableName: config.tokens_table_name,
        Item: {
            TokenType: tokenType,
            Value: tokenValue,
        }
    })
    const response = await ddbDocClient.send(putTokenCommand)
}

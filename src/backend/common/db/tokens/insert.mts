import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";
import { tokenType } from "./types.mjs";
import { getRandomInt, getTimestamp, sleep } from "../../utilities.mjs";
import config from "./config.json" assert { type: "json" }
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const insertToken = async (tokenType: tokenType, tokenValue: string, expiresIn: number): Promise<void> => {
    const putTokenCommand = new PutCommand({
        TableName: config.tokens_table_name,
        Item: {
            TokenType: tokenType,
            value: tokenValue,
            createdAt: getTimestamp(),
            expiresIn: expiresIn
        },
    })
    const response = await client.send(putTokenCommand)
    
    
}

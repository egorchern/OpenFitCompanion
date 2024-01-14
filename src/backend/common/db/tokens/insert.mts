import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, TransactWriteCommand} from "@aws-sdk/lib-dynamodb";
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
    const putTokenCommand = new TransactWriteCommand({
        TransactItems: [
            {
                Put: {
                    Item: {
                        TokenType: tokenType,
                        value: tokenValue,
                        createdAt: getTimestamp(),
                        expiresIn: expiresIn
                    },
                    TableName: config.tokens_table_name
                }
            }
        ]
        
    })
    try {
        const response = await ddbDocClient.send(putTokenCommand)
    }  
    catch {
        await sleep(getRandomInt(200, 1000))
        return insertToken(tokenType, tokenValue, expiresIn)
    }
    
    
}

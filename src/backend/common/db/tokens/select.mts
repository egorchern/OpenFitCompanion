import { DynamoDBClient, DynamoDBClientConfig} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, TransactGetCommand} from "@aws-sdk/lib-dynamodb";
import { Token, tokenType } from "./types.mjs";
import {getRandomInt, sleep} from "../../utilities.mjs"
import config from "./config.json" assert { type: "json" }
const dbConfig: DynamoDBClientConfig = {}
if (process.env.NODE_ENV === "dev"){
    dbConfig.endpoint = config.LocalDbEndpoint
}
const client = new DynamoDBClient(dbConfig);
const ddbDocClient = DynamoDBDocumentClient.from(client);

export const getToken = async (tokenType: tokenType): Promise<Token | null> => {
    const command = new TransactGetCommand({
        TransactItems: [{
            Get: {
                Key: {
                    TokenType: tokenType
                },
                TableName: config.tokens_table_name
            }
        }]
    })
    try {
        const response = await ddbDocClient.send(command)
        if (!response?.Responses){
            return null
        }
        return response.Responses[0].Item as Token
    }   
    catch {
        await sleep(getRandomInt(200, 1000))
        return getToken(tokenType)
    }
    
}

import { requestRefreshToken } from "../db/tokens.mjs";
import { PutTokens } from "../db/insert.mjs";


export const handler = async (event:any, context:any) =>  {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    const queryParams = event.queryStringParameters
    // user allowed oauth, and we have authorization code in query params
    if(!queryParams?.code){
        return {
            statusCode: 400
        }
    }
    const authorization_code = queryParams.code
    try {
        const {refreshToken, accessToken, userId} = await requestRefreshToken(authorization_code)
        await PutTokens(refreshToken, accessToken, userId)
        return {
            statusCode: 200
        }
    } catch (err) {
        return {
            statusCode: 400
        }
    }
    
}

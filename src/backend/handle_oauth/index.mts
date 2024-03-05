import { requestRefreshToken } from "../common/api_requests/withings/tokens/tokens.mjs";
import { insertToken } from "../common/db/tokens/insert.mjs";
import { tokenType } from "../common/db/tokens/types.mjs";


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
        await Promise.all([insertToken(tokenType.RefreshToken, refreshToken, 1), insertToken(tokenType.UserId, userId, 1)])
        return {
            statusCode: 200
        }
    } catch (err) {
        return {
            statusCode: 400
        }
    }
    
}


import { insertToken } from "./db/tokens/insert.mjs"
import { getToken } from "./db/tokens/select.mjs"
import { tokenType } from "./db/tokens/types.mjs"
import { generateHash, generateSignature, getTimestamp } from "./utilities.mjs"

const WithingsOAUTHUrl = "https://wbsapi.withings.net/v2/oauth2"
const WithingsSignatureUrl = "https://wbsapi.withings.net/v2/signature"
const callback_url = "https://mqlqruemltdxgulrkn2ohwnila0xsmkm.lambda-url.us-east-1.on.aws/"


export const getAccessToken = async () => {
    const curAccessToken = await getToken(tokenType.AccessToken)
    const curEpoch = getTimestamp()
    if (!curAccessToken || curEpoch >= curAccessToken.createdAt + curAccessToken.expiresIn){
        const refreshToken = (await getToken(tokenType.RefreshToken))?.value
        if (!refreshToken){
            throw new Error("You have not authorized your application with your account")
        }
        const temp = await requestAccessToken(refreshToken)
        await Promise.all([insertToken(tokenType.RefreshToken, temp.refreshToken, 1), insertToken(tokenType.AccessToken, temp.accessToken, temp.expiresIn)])
        
        return temp.accessToken
    }
    return curAccessToken.value
}

export const requestRefreshToken = async (authorizationCode: string) => {
    const {nonce} = await requestNonce()
    const signature = generateSignature("requesttoken", nonce)
    let params = new URLSearchParams({
        action: "requesttoken",
        client_id: process.env.WITHINGS_CLIENT_ID ?? "",
        nonce: nonce,
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: callback_url,
        signature: signature
    })

    const response = await fetch(WithingsOAUTHUrl, {
        method: "POST",
        body: params.toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    const result = await response.json()
    if(!result.body?.refresh_token){
        throw new Error
    }
    const refreshToken: string = result.body.refresh_token
    const accessToken: string = result.body.access_token
    const userId: string = result.body.userid
    return {refreshToken, accessToken, userId}
    
}

export const requestAccessToken = async (curRefreshToken: string) => {
    const {nonce} = await requestNonce()
    const signature = generateSignature("requesttoken", nonce)
    let params = new URLSearchParams()
    params.append("action", "requesttoken")
    params.append("client_id", process.env.WITHINGS_CLIENT_ID ?? "" )
    params.append("nonce", nonce)
    params.append("signature", signature)
    params.append("refresh_token", curRefreshToken)
    params.append("grant_type", "refresh_token")
    const response = await fetch(WithingsOAUTHUrl, {
        method: "POST",
        body: params.toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    })
    const result = await response.json()
    console.log(result)
    if(!result.body?.access_token){
        throw new Error
    }
    const refreshToken: string = result.body.refresh_token
    const accessToken: string = result.body.access_token
    const expiresIn: number = result.body.expires_in
    return {refreshToken, accessToken, expiresIn}
}

export const requestNonce = async () => {
    const timestamp = Math.floor(Date.now() / 1000).toString()
    const signature = generateHash(["getnonce", process.env.WITHINGS_CLIENT_ID ?? "", timestamp])
    const queryUrl = new URL(WithingsSignatureUrl)
    queryUrl.search = new URLSearchParams({
        action: "getnonce",
        client_id: process.env.WITHINGS_CLIENT_ID ?? "",
        timestamp: timestamp,
        signature: signature
    }).toString()
    const response = await fetch(queryUrl, {
        method: "POST",
    })
    const result = await response.json()
    if(!result.body?.nonce){
        throw new Error
    }
    const nonce = result.body.nonce
    return {nonce}
}

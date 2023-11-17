
import { generateHash, generateSignature } from "./utilities.mjs"

const WithingsOAUTHUrl = "https://wbsapi.withings.net/v2/oauth2"
const WithingsSignatureUrl = "https://wbsapi.withings.net/v2/signature"
const callback_url = "https://mqlqruemltdxgulrkn2ohwnila0xsmkm.lambda-url.us-east-1.on.aws/"


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
    const refreshToken = result.body.refresh_token
    const accessToken = result.body.access_token
    const userId = result.body.userid
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
    const refreshToken = result.body.refresh_token
    const accessToken = result.body.access_token
    return {refreshToken, accessToken}
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

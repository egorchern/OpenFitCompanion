import { notificationCategory } from "./types.mjs"
const baseUrl = 'https://api.ouraring.com/v2/webhook/subscription'
const callbackUrl = "https://clvlbqpqkifl2a6naigz23rzsi0rqmvg.lambda-url.us-east-1.on.aws/"

export const subscribe = async (category: notificationCategory) => {
    const queryUrl = new URL(baseUrl)
    const clientId = process.env.OURA_CLIENT_ID ?? ""
    const clientSecret = process.env.OURA_CLIENT_SECRET ?? ""
    const response = await fetch(queryUrl, {
        method: "POST",
        body: JSON.stringify({
            callback_url: callbackUrl,
            event_type: "create",
            data_type: category,
            verification_token: "123"
        }),
        headers: new Headers({
            "x-client-id": clientId,
            "x-client-secret": clientSecret,
            "Content-Type": "application/json"
        })
    })
    const result = await response.json()
    console.log(result)
}

await subscribe(notificationCategory.Activity)
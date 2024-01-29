
import { notificationCategory } from "./types.mjs"
import { getAccessToken } from "../tokens/tokens.mjs"
const WithingsNotifyUrl = "https://wbsapi.withings.net/notify"
const callbackUrl = "https://rrcimmcmlqvl7n2gj7a36xdqku0zehth.lambda-url.us-east-1.on.aws/"
export const subscribe = async (accessToken: string, category: notificationCategory) => {
    const queryUrl = new URL(WithingsNotifyUrl)
    queryUrl.search += new URLSearchParams({
        action: "subscribe",
        appli: category.toString(),
        
    }).toString()
    queryUrl.search += `&callbackurl=${callbackUrl}`
    
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    
}

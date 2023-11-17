
import { notificationCategory } from "./types.mjs"
import { getToken } from "../../db/tokens/select.mjs"
import { tokenType } from "../../db/tokens/types.mjs"
import { putToken } from "common/db/tokens/insert.mjs"
const WithingsNotifyUrl = "https://wbsapi.withings.net/notify"
const callbackUrl = "https://mqlqruemltdxgulrkn2ohwnila0xsmkm.lambda-url.us-east-1.on.aws/"
export const subscribe = async (category: notificationCategory) => {
    const accessToken = getToken(tokenType.AccessToken)
    const queryUrl = new URL(WithingsNotifyUrl)
    queryUrl.search = new URLSearchParams({
        action: "subscribe",
        callbackurl: callbackUrl,
        appli: category.toString(),
        
    }).toString()
    const response = await fetch(queryUrl, {
        method: "POST",
        headers: new Headers({
            "Authorization": `Bearer ${accessToken}`
        })
    })
    const result = await response.json()
    console.log(result)
}

const withings_oauth_url = "https://wbsapi.withings.net/v2/oauth2"
import {get_authorization_code} from "../db/select.mjs"
export const handler = async (event:any, context:any) =>  {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    const authorization_code = get_authorization_code();
    fetch(withings_oauth_url, {
        method: "POST",
        body: JSON.stringify({
            action: "requesttoken",
            client_id: process.env.WITHINGS_CLIENT_ID,
            client_secret: process.env.WITHINGS_SECRET,
            grant_type: "authorization_code",
            code: authorization_code,
            redirect_uri: "https://www.withings.com"
        })
    })
    .then(res => res.json())
    .then(res => {
        console.log(res)
    })
    .catch(err => {

    })
}
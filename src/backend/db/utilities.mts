import {createHmac} from "crypto"
export const generateHash = (items: string[]) => {
    // concat items
    const plaintext = items.join(",")
    const secret = process.env.WITHINGS_SECRET ?? ""
    return createHmac("sha256", secret).update(plaintext).digest("hex")
}

export const generateSignature = (action: string, nonce: string) => {
    return generateHash([action, process.env.WITHINGS_CLIENT_ID ?? "", nonce])
}
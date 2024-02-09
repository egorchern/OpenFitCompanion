import { writeFileSync } from "fs"
import { scanHealthData } from "./db/healtData/scan.mjs"
import { json2csv } from "json-2-csv"
import { getTimestamp } from "./utilities.mjs"
import { PutObjectCommand, S3Client, GetObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
const bucketName = "open-fit-companion"
const linkExpirySeconds = 60 * 5
const client = new S3Client({});
const getDownloadURL = async (csvData: string, filename: string) => {
    const expireObjectMinutes = 60
    const expiryTimestamp = new Date()
    expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + expireObjectMinutes)
    const putCommand = new PutObjectCommand({
        Body: csvData,
        Bucket: bucketName,
        Key: filename,
        Expires: expiryTimestamp
    })
    const putResponse = await client.send(putCommand)
    const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: filename
    })
    const url = await getSignedUrl(client as any, getCommand as any, {
        expiresIn: linkExpirySeconds
    })
    return url
}
export const exportHealthData = async () => {
    const data = await scanHealthData()
    const csv = await json2csv(data, {
        emptyFieldValue: ""
    })
    const filename = `healthData_${new Date().toISOString().substring(0, 19).replaceAll(":", "_", )}.csv`
    // upload to s3
    return getDownloadURL(csv, filename)
}


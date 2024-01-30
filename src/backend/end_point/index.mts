import { handleRequest } from "./controller.mjs";

export const handler = async (event: any) => {
  if (typeof event === 'string') {
    event = JSON.parse(event);
  }
  console.log(event)
  const method = event?.requestContext?.http?.method
  const path = event?.requestContext?.http?.path
  const secret = event?.headers?.authorization
  const referenceSecret = `Bearer ${process.env.PERSONAL_SECRET}`
  if (!method || !path || !secret || secret !== referenceSecret) {
    return {
      statusCode: 400
    }
  }
  return handleRequest(method, path, event)


}


await handler({
    queryStringParameters: {
        startdate: "2024-01-10",
        enddate: "2024-01-20"
    },
    requestContext: {
        http: {
            method: "POST",
            path: "/pushSubscription"
        }
    },
    body: `{"endpoint":"https://fcm.googleapis.com/fcm/send/dYCoWssAveo:APA91bH6zGo03gUyS5rr7hoDbDgSvpiRSiqf0Rr02KN_037Rx5x7ibuIbLaA-Oj0YWBBBf6gXiq0d5GYicE3-aqMP_cibBiNS1SKQhrmEkvckNJHxCfur6bN_zvarv19vis2ZqPFiAaf","expirationTime":null,"keys":{"p256dh":"BJPfNyMWn1PsZLDPVRd2LFQGqCs28TMheqi1qEewUZLq3idUMlTDIQ6ohHlW4jexo5GhAHdN572d4v--OhZlwD0","auth":"3siKCjE3Cg8czBRqTStB-Q"}}`,
    headers: {
        authorization: `Bearer ${process.env.PERSONAL_SECRET}`
    }
})
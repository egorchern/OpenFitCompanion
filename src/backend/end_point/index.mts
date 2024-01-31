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

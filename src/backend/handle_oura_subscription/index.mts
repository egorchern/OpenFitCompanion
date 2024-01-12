export const handler = async (event: any) => {
    if (typeof event === 'string'){
        event = JSON.parse(event);
    }
    console.log(event)
    const method = event?.requestContext?.http?.method
    if (!method){
        return {
            statusCode: 400
        }
    }
    if (method === "GET"){
        const challenge = event?.queryStringParameters?.challenge
        if (!challenge){
            return {
                statusCode: 400
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                challenge: challenge
            })
        }

    }
    else if (method === "POST"){
        return {
            statusCode: 200
        }
    } 
    else {
        return {
            statusCode: 400
        }
    }
    
  };
  
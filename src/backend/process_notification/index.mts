import { HealthDataType } from "../common/db/healtData/types.mjs";
import { insertHealthData } from "../common/db/healtData/insert.mjs";
import { Provider } from "../common/types.mjs";
import { getAdapter } from "../common/adapter.mjs";
import { unify } from "../common/data.mjs";


export const handler = async (
  event: any,
  context: any
) => {
  for (const record of event.Records) {
    // const message: string = JSON.stringify(record.Sns.Message).replaceAll("\"", "");
    const message = record.Sns.Message
    const obj = JSON.parse(message);
    console.log(`Processing: ${message}`);
    await processNotification(obj)
  }
};


export const processNotification = async (obj: any) => {
    const provider = obj.provider as Provider
    const adapter = getAdapter(provider);
    const data = await adapter.processNotification(obj);
    await insertHealthData(data);
    await unify(data.date, data.type)
}


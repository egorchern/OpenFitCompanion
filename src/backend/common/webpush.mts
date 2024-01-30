import webpush, {SendResult} from "web-push"

const publicVapidKey = "BK_iCBtor9gJt6rr15_KnU6Ip8VzqTcxxxf_93AwbAKOc9n8x0QN9pd-w15BjcqdIohDoRrAROx3Zs1GDvU9bWA"
const privateVapidKey = process.env.VAPID_PRIVATE_KEY ?? "";

export const sendPushNotification = async (title: string, body: string, subscription: any) => {
  webpush.setVapidDetails(
    'mailto:egor.chernyshev@student.manchester.ac.uk',
    publicVapidKey,
    privateVapidKey,
  );
  
  const notification = {title, body}
  await webpush.sendNotification(subscription, JSON.stringify(notification))
};

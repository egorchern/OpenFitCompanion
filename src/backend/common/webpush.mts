// import webpush, {SendResult} from "web-push"

// // const publicVapidKey = process.env.VAPID_PUBLIC_KEY ?? ""
// // const privateVapidKey = process.env.VAPID_PRIVATE_KEY ?? "";

// export const sendPushNotification = async (title: string, body: string) => {
//   webpush.setVapidDetails(
//     'mailto:test@test.com',
//     publicVapidKey,
//     privateVapidKey,
//   );
//   const subscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/c4w8YXA1ruI:APA91bEAtVd4ou1QymGRVVY1BOc216eIbmO97VioQf50j74v8zp9VLj2AbIFbyQs5KxCYUwn4Wca1shOqU_fEAX2m4wT_ENbYuzJtIw9wDPJwLpkXpsbGbj72ED97J6LhlT_XxlzO8BX","expirationTime":null,"keys":{"p256dh":"BHiawB-X89fkUTbh48dXaBTUihll4FQdHcg6-mlrc47eGDQtIBYcRMyqUnZP4y6EhfjOtYJbcMQsFZerE7iaNsk","auth":"VEAkuFWjbscFjUlOTYLBzA"}}
//   const notification = {title, body}
//   await webpush.sendNotification(subscription, JSON.stringify(notification))
// };

// sendPushNotification("test", "hello")
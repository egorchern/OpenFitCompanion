/* eslint-disable no-restricted-globals */
const publicVapidKey =
    "BK_iCBtor9gJt6rr15_KnU6Ip8VzqTcxxxf_93AwbAKOc9n8x0QN9pd-w15BjcqdIohDoRrAROx3Zs1GDvU9bWA";

const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = self.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};
const submitSubscription = (subscription) => {

}
self.addEventListener("activate", async (event) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log(JSON.stringify(subscription))
    submitSubscription(subscription)
});

self.addEventListener("push", (e) => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
    });
});

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
const baseApi =
    "https://j36jvcdbxaumnmb7odfz64rjoa0ozyzj.lambda-url.us-east-1.on.aws";
const submitSubscription = async (subscription, API_SECRET) => {
    const response = await fetch(`${baseApi}/pushSubscription`, {
        body: JSON.stringify(subscription),
        headers: {
            authorization: `Bearer ${API_SECRET}`,
        },
        method: "POST",
    });
    if (!response.ok) {
        console.log("err");
        throw Error("bad token");
    }
    const result = await response.json();
    console.log(result);
};

self.addEventListener("activate", async (event) => {});

const handleSubscription = async (API_SECRET) => {
    const subscriptionExists =
        !!(await self.registration.pushManager.getSubscription());
    if (subscriptionExists) {
        return;
    }
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log(JSON.stringify(subscription));
    submitSubscription(subscription, API_SECRET);
};

addEventListener("message", (event) => {
    // event is an ExtendableMessageEvent object
    const API_SECRET = event.data;
    handleSubscription(API_SECRET);
});

self.addEventListener("push", (e) => {
    const data = e.data.json();
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon
    });
});

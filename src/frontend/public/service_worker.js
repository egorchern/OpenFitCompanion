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

self.addEventListener("activate", async (event) => {
});

const handleSubscription = async (API_SECRET) => {
    const existingSubscription =
        (await self.registration.pushManager.getSubscription());
    if (!!existingSubscription) {
        
        return existingSubscription
    }
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    // submitSubscription(subscription, API_SECRET);
    return subscription
};

addEventListener("message", async (event) => {
    // event is an ExtendableMessageEvent object
    const API_SECRET = event.data;
    const subscription = await handleSubscription(API_SECRET);
    console.log(JSON.stringify(subscription))
});

self.addEventListener("push", (e) => {
    const data = e.data.json();
    console.log(data)
    const url = data.url
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: data.icon,
        data: {
            url: url
        }
    });
});

// Notification click event listener
self.addEventListener("notificationclick", (ev) => {
    // Close the notification popout
    ev.notification.close();
    const url = ev?.notification?.data?.url
    // Get all the Window clients
    ev.waitUntil(
      clients.matchAll({ type: "window" }).then((clientsArr) => {
        // If a Window tab matching the targeted URL already exists, focus that;
        const hadWindowToFocus = clientsArr.some((windowClient) =>
          windowClient.url === url
            ? (windowClient.focus(), true)
            : false,
        );
        // Otherwise, open a new tab to the applicable URL and focus it.
        if (!hadWindowToFocus)
          clients
            .openWindow(url)
            .then((windowClient) => (windowClient ? windowClient.focus() : null));
      }),
    );
  });

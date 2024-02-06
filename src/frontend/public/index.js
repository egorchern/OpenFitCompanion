
const main = async () => {
  if ('serviceWorker' in navigator) {
    const notificationPermission = await Notification.requestPermission()
    if (!notificationPermission || notificationPermission !== "granted"){
      return
    }
    await navigator.serviceWorker.register('/service_worker.js', {
      scope: '/',
    });
    const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
    if (!PERSONAL_SECRET){
      return
    }
    const registration = await navigator.serviceWorker.ready
    navigator.serviceWorker.addEventListener("message", (event) => {
      // event is a MessageEvent object
      document.getElementById("alerting").innerText += event.data
    });
    registration.active.postMessage(PERSONAL_SECRET)
  }
}
main()
  // const subscribe = async () => {
  //   if (!('serviceWorker' in navigator)) return;
  
  //   const registration = await navigator.serviceWorker.ready;
  
  //   // Subscribe to push notifications
  //   const subscription = await registration.pushManager.subscribe({
  //     userVisibleOnly: true,
  //     applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
  //   });
  //   console.log(subscription)
  //   console.log(JSON.stringify(subscription))
  // };
  // subscribe()
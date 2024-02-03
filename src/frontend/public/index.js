
const main = async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service_worker.js', {
      scope: '/',
    });
    const PERSONAL_SECRET = localStorage.getItem("API_SECRET")
    if (!PERSONAL_SECRET){
      return
    }
    const registration = await navigator.serviceWorker.ready
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
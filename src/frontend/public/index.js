// Check if service workers are supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service_worker.js', {
      scope: '/',
    });
  }

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
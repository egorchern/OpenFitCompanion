// Check if service workers are supported
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service_worker.js', {
      scope: '/',
    });
  }
  
  const publicVapidKey = "BGxnRJGE30fOrtALDgkEcgEaen56202HzjV3nmw19pGcRxDFmETghXxEk6QuuMaXbujSp0KJf4X9e0Qltf9l8wg"
  
  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  
  const subscribe = async () => {
    if (!('serviceWorker' in navigator)) return;
  
    const registration = await navigator.serviceWorker.ready;
  
    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    console.log(subscription)
    console.log(JSON.stringify(subscription))
    alert(JSON.stringify(subscription))
  };
  subscribe()
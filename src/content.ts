/* interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

function updatePrayerTimesInHTML(prayerTimes: PrayerTimes) {
    console.log('Updating prayer times:', prayerTimes);
    const fajrElement = document.getElementById('fajr');
    const sunriseElement = document.getElementById('sunrise');
    const dhuhrElement = document.getElementById('dhuhr');
    const asrElement = document.getElementById('asr');
    const maghribElement = document.getElementById('maghrib');
    const ishaElement = document.getElementById('isha');

    if (fajrElement) {
        fajrElement.innerHTML = `<span>Fajr</span> : ${prayerTimes.Fajr}`;
    }
    if (sunriseElement) {
        sunriseElement.innerHTML = `<span>Sunrise</span> : ${prayerTimes.Sunrise}`;
    }
    if (dhuhrElement) {
        dhuhrElement.innerHTML = `<span>Dhuhr</span> : ${prayerTimes.Dhuhr}`;
    }
    if (asrElement) {
        asrElement.innerHTML = `<span>Asr</span> : ${prayerTimes.Asr}`;
    }
    if (maghribElement) {
        maghribElement.innerHTML = `<span>Maghrib</span> : ${prayerTimes.Maghrib}`;
    }
    if (ishaElement) {
        ishaElement.innerHTML = `<span>Isha</span> : ${prayerTimes.Isha}`;
    }
}

console.log('Content script loaded'); 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script:', message);
    if (message.type === 'UPDATE_PRAYER_TIMES') {
        updatePrayerTimesInHTML(message.timings);
    }
}); */
/* chrome.runtime.sendMessage({ type: "getActiveTabRequest" }, (response) => {
    console.log(response);
  });
 */



  
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "messageFromBackground") {
      console.log("Message received from background script:", message);
  
    }
  });
  
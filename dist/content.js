"use strict";
function updatePrayerTimesInHTML(prayerTimes) {
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
function showOfflineMessage() {
    const offlineMessageElement = document.getElementById('userOffline');
    if (offlineMessageElement) {
        offlineMessageElement.textContent = 'Make sure to check your internet connection.';
    }
}
chrome.storage.local.get('prayerTimes', (items) => {
    const prayerTimes = items.prayerTimes;
    if (prayerTimes) {
        updatePrayerTimesInHTML(prayerTimes);
    }
    else {
        showOfflineMessage();
    }
});

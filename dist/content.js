"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getPrayerTimes(city_1, country_1) {
    return __awaiter(this, arguments, void 0, function* (city, country, method = 2, methodSettings) {
        const API_URL = 'https://api.aladhan.com/v1/timingsByCity';
        let url = `${API_URL}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;
        if (method === 99 && methodSettings) {
            url += `&method=99&methodSettings=${encodeURIComponent(methodSettings)}`; // adjusting the custom method settings 
        }
        else {
            url += `&method=${method}`;
        }
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data.code === 200 && data.status === 'OK') {
                console.log(`Prayer Times for ${city}, ${country}:`);
                console.log('Fajr:', data.data.timings.Fajr);
                console.log('Sunrise:', data.data.timings.Sunrise);
                console.log('Dhuhr:', data.data.timings.Dhuhr);
                console.log('Asr:', data.data.timings.Asr);
                console.log('Maghrib:', data.data.timings.Maghrib);
                console.log('Isha:', data.data.timings.Isha);
                return data.data.timings;
            }
            else {
                console.error('Failed to fetch prayer times:', data);
            }
        }
        catch (error) {
            console.error('Error fetching prayer times:', error);
        }
        return null;
    });
}
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
function initializePrayerTimes() {
    return __awaiter(this, void 0, void 0, function* () {
        const prayerTimes = yield getPrayerTimes('Tunis', 'Tunisia', 99, '18,null,18');
        if (prayerTimes) {
            const selectedPrayerTimes = {
                Fajr: prayerTimes.Fajr,
                Dhuhr: "05:46",
                Asr: prayerTimes.Asr,
                Isha: prayerTimes.Isha,
                Maghrib: prayerTimes.Maghrib
            };
            updatePrayerTimesInHTML(prayerTimes);
            chrome.runtime.sendMessage({ type: "getActiveTabRequest", timings: selectedPrayerTimes }, (response) => {
                console.log(response);
            });
        }
    });
}
console.log('Content script loaded');
initializePrayerTimes();

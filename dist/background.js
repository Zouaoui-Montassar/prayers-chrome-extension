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
let storedPrayerTimes = null;
function requestNotificationPermission() {
    console.log('Checking notification permission...');
    chrome.permissions.contains({ permissions: ['notifications'] }, (result) => {
        if (!result) {
            chrome.permissions.request({ permissions: ['notifications'] }, (granted) => {
                if (granted) {
                    console.log('Notifications permission granted.');
                }
                else {
                    console.log('Notifications permission denied.');
                }
            });
        }
        else {
            console.log('Notifications permission already granted.');
        }
    });
}
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed, requesting notification permission...');
    requestNotificationPermission();
});
function showNotification(prayerName) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/placeholder.png',
        title: 'Prayer Time Reminder',
        message: `${prayerName} time has arrived!`,
        priority: 2,
    });
}
function checkPrayerTimes() {
    console.log("prayer times from the check", storedPrayerTimes);
    if (!storedPrayerTimes) {
        console.log("prayer times not initilized");
    }
    ;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const currentTime = `${formattedHours}:${formattedMinutes}`;
    console.log("now time is ", currentTime);
    for (const prayerName in storedPrayerTimes) {
        if (storedPrayerTimes.hasOwnProperty(prayerName)) {
            const prayerTime = storedPrayerTimes[prayerName].slice(0, 5);
            console.log("from the loop : ", prayerTime);
            console.log("current time : ", currentTime);
            if (currentTime === prayerTime) {
                console.log("showed notification for", prayerName);
                showNotification(prayerName);
            }
        }
    }
}
function clearPrayerTimes() {
    chrome.storage.local.remove('prayerTimes', () => {
        console.log('Prayer times removed from storage.');
    });
}
function getPrayerTimes(city_1, country_1) {
    return __awaiter(this, arguments, void 0, function* (city, country, method = 2, methodSettings) {
        const API_URL = 'http://api.aladhan.com/v1/timingsByCity';
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
                storedPrayerTimes = data.data.timings;
                checkPrayerTimes();
                /*             clearPrayerTimes(); */
                chrome.storage.local.set({ prayerTimes: storedPrayerTimes }, () => {
                    console.log('Prayer times stored:', storedPrayerTimes);
                });
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
getPrayerTimes('Tunis', 'Tunisia', 99, '18,null,18');
setInterval(checkPrayerTimes, 50 * 1000);

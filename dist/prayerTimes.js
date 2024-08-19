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
const API_URL = 'https://api.aladhan.com/v1/timingsByCity';
const city = 'Tunis';
const country = 'Tunisia';
const url = `${API_URL}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;
function getPrayerTimes() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(url);
            const data = yield response.json();
            if (data.code === 200 && data.status === 'OK') {
                console.log('Prayer Times for Tunis:');
                console.log('Fajr:', data.data.timings.Fajr);
                console.log('Sunrise:', data.data.timings.Sunrise);
                console.log('Dhuhr:', data.data.timings.Dhuhr);
                console.log('Asr:', data.data.timings.Asr);
                console.log('Maghrib:', data.data.timings.Maghrib);
                console.log('Isha:', data.data.timings.Isha);
            }
            else {
                console.error('Failed to fetch prayer times:', data);
            }
        }
        catch (error) {
            console.error('Error fetching prayer times:', error);
        }
    });
}
getPrayerTimes();

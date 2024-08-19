const API_URL = 'http://api.aladhan.com/v1/timingsByCity';
const city = 'Tunis';
const country = 'Tunisia';


const url = `${API_URL}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;

async function getPrayerTimes() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.code === 200 && data.status === 'OK') {
            console.log('Prayer Times for Tunis:');
            console.log('Fajr:', data.data.timings.Fajr);
            console.log('Sunrise:', data.data.timings.Sunrise);
            console.log('Dhuhr:', data.data.timings.Dhuhr);
            console.log('Asr:', data.data.timings.Asr);
            console.log('Maghrib:', data.data.timings.Maghrib);
            console.log('Isha:', data.data.timings.Isha);
        } else {
            console.error('Failed to fetch prayer times:', data);
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
    }
}


getPrayerTimes();

interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

interface PrayerTimesResponse {
    code: number;
    status: string;
    data: {
        timings: PrayerTimes;
    };
}


function showNotification(prayerName: string) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/placeholder.png',
        title: 'Prayer Time Reminder',
        message: `${prayerName} time has arrived!`,
        priority: 2,
    });
}
async function getPrayerTimes(city: string, country: string, method: number = 2, methodSettings?: string): Promise<PrayerTimes | null> {

    const API_URL = 'http://api.aladhan.com/v1/timingsByCity';
    let url = `${API_URL}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`;

    if (method === 99 && methodSettings) {
        url += `&method=99&methodSettings=${encodeURIComponent(methodSettings)}`; // adjusting the custom method settings 
    } else {
        url += `&method=${method}`;
    }

    try {
        const response = await fetch(url);
        const data: PrayerTimesResponse = await response.json();

        if (data.code === 200 && data.status === 'OK') {
            console.log(`Prayer Times for ${city}, ${country}:`);
            console.log('Fajr:', data.data.timings.Fajr);
            console.log('Sunrise:', data.data.timings.Sunrise);
            console.log('Dhuhr:', data.data.timings.Dhuhr);
            console.log('Asr:', data.data.timings.Asr);
            console.log('Maghrib:', data.data.timings.Maghrib);
            console.log('Isha:', data.data.timings.Isha);

            chrome.runtime.sendMessage({ type: 'UPDATE_PRAYER_TIMES', timings: data.data.timings });
            
            return data.data.timings;
        } else {
            console.error('Failed to fetch prayer times:', data);
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
    }
    return null
}

getPrayerTimes('Tunis', 'Tunisia', 99, '18,null,18');
showNotification('TEST');




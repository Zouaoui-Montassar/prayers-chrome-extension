interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key:string ]:string ;
}

interface PrayerTimesResponse {
    code: number;
    status: string;
    data: {
        timings: PrayerTimes;
    };
}

let storedPrayerTimes: PrayerTimes | null = null;

function showNotification(prayerName: string) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: '../assets/placeholder.png',
        title: 'Prayer Time Reminder',
        message: `${prayerName} time has arrived!`,
        priority: 2,
    });
}
function checkPrayerTimes() {
    if (!storedPrayerTimes) {
        console.log("prayer times not initilized"); // HEDHI MCHET
    };

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    // Manually format the time
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const currentTime = `${formattedHours}:${formattedMinutes}`;
    console.log("now time is " , currentTime)
    for (const prayerName in storedPrayerTimes) {
        if (storedPrayerTimes.hasOwnProperty(prayerName)) {
            const prayerTime = storedPrayerTimes[prayerName].slice(0, 5); // Get HH:mm from HH:mm:ss
            console.log("from the loop : ", prayerTime);
            console.log("current time : ",currentTime);
            if (currentTime === prayerTime) {
                console.log("showed noti");
                showNotification(prayerName);
            }
        }
    }
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

            /* chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const tabId = tabs[0]?.id;
                console.log('Active tab ID:', tabId);
                if (tabId !== undefined) {
                    chrome.tabs.sendMessage(tabId, {
                        type: 'UPDATE_PRAYER_TIMES',
                        timings: {
                            Fajr: '05:00',
                            Sunrise: '06:30',
                            Dhuhr: '12:00',
                            Asr: '15:30',
                            Maghrib: '19:00',
                            Isha: '20:30'
                        }
                    }, function(response) {
                        if (chrome.runtime.lastError) {
                            console.error('Message sending failed:', chrome.runtime.lastError);
                        } else {
                            console.log('Message sent successfully');
                        }
                    });
                } else {
                    console.error('No active tab found.');
                }
            }); */
            chrome.storage.local.set({ prayerTimes: data.data.timings }, () => {
                console.log('Prayer times stored:', data.data.timings);
            });
            
            
            
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
 setInterval(checkPrayerTimes, 60 * 1000); 
/* showNotification('TEST');  */

/* chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    sendResponse('I GOT IT');
    console.log("the prayer times to store " ,message.timings)
    if (message.type === 'getActiveTabRequest') {
        storedPrayerTimes = message.timings;
        checkPrayerTimes();
        console.log('Prayer times updated:', storedPrayerTimes);
        sendResponse('Prayer times received and stored.');
    }
}); */
/* interface PrayerTimes {
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

            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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
showNotification('TEST'); */


/* 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    console.log("-----------------");
    console.log(sender) ;
    sendResponse("Response from extension ServiceWorker");
  }); */

  
  function sendMessageToContentScript() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["dist/content.js"]
            }, () => {
                
                chrome.tabs.sendMessage(tabs[0].id!, { type: "messageFromBackground" }, (response) => {
                    console.log("Response from content script:", response);
                    if (chrome.runtime.lastError) {
                        console.error("Error:", chrome.runtime.lastError.message);
                    }
                });
            });
        }
    });
}

sendMessageToContentScript();


  
  
  
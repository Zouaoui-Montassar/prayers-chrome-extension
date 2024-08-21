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

export {
    PrayerTimes,
    PrayerTimesResponse
}
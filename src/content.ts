interface PrayerTimes {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

class SalatCalculator {
    private latitude: number;
    private longitude: number;
    private timezone: number;

    constructor(latitude: number, longitude: number, timezone: number) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timezone = timezone;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    private rad2deg(rad: number): number {
        return rad * (180 / Math.PI);
    }

    private calculateJulianDate(date: Date): number {
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();
        
        if (month <= 2) {
            year -= 1;
            month += 12;
        }

        const A = Math.floor(year / 100);
        const B = 2 - A + Math.floor(A / 4);
        
        return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
    }

    private calculateSunDeclination(julianDate: number): number {
        const D = julianDate - 2451545.0;
        const g = 357.529 + 0.98560028 * D;
        const q = 280.459 + 0.98564736 * D;
        const L = q + 1.915 * Math.sin(this.deg2rad(g)) + 0.020 * Math.sin(this.deg2rad(2 * g));
        const e = 23.439 - 0.00000036 * D;
        
        return this.rad2deg(Math.asin(Math.sin(this.deg2rad(e)) * Math.sin(this.deg2rad(L))));
    }

    private calculateEquationOfTime(julianDate: number): number {
        const D = julianDate - 2451545.0;
        const g = 357.529 + 0.98560028 * D;
        const q = 280.459 + 0.98564736 * D;
        const L = q + 1.915 * Math.sin(this.deg2rad(g)) + 0.020 * Math.sin(this.deg2rad(2 * g));
        const e = 23.439 - 0.00000036 * D;
        
        const RA = this.rad2deg(Math.atan2(Math.cos(this.deg2rad(e)) * Math.sin(this.deg2rad(L)), Math.cos(this.deg2rad(L)))) / 15;
        const solarNoon = (L - q) / 15;
        
        // Correct Equation of Time calculation
        return solarNoon - RA;
    }
    
    
    

    private calculateTime(angle: number, declination: number, equationOfTime: number, isMorning: boolean): number {
        const latRad = this.deg2rad(this.latitude);
        const decRad = this.deg2rad(declination);
        const angleRad = this.deg2rad(angle);
    
        const H = Math.acos(
            (-Math.sin(angleRad) - Math.sin(latRad) * Math.sin(decRad)) /
            (Math.cos(latRad) * Math.cos(decRad))
        );
    
        const localTime = (720 - (4 * (this.longitude + this.rad2deg(H) * (isMorning ? -1 : 1))) - equationOfTime) / 60;
        
        console.log(`Latitude: ${this.latitude}, Longitude: ${this.longitude}`);
        console.log(`Angle: ${angle}, Declination: ${declination}, Equation of Time: ${equationOfTime}`);
        console.log(`Local Time (in decimal hours): ${localTime}`);
        
        // Return the time adjusted for timezone
        return localTime + this.timezone;
    }
    
    
    
    
    
    

    public getPrayerTimes(date: Date): PrayerTimes {
        // Calculate Julian Date, Sun Declination, and Equation of Time
        const julianDate = this.calculateJulianDate(date);
        const declination = this.calculateSunDeclination(julianDate);
        const equationOfTime = this.calculateEquationOfTime(julianDate);
    
        // Log calculated values for debugging
        console.log(`Julian Date: ${julianDate}`);
        console.log(`Declination: ${declination}`);
        console.log(`Equation of Time: ${equationOfTime}`);
    
        // Calculate and log each prayer time
        console.log(`Fajr Time Calculation:`);
        const fajrTime = this.calculateTime(18, declination, equationOfTime, true);
        console.log(`Fajr Time (Decimal Hours): ${fajrTime}`);
        console.log(`Formatted Fajr Time: ${this.formatTime(fajrTime)}`);
    
        console.log(`Sunrise Time Calculation:`);
        const sunriseTime = this.calculateTime(-0.833, declination, equationOfTime, true);
        console.log(`Sunrise Time (Decimal Hours): ${sunriseTime}`);
        console.log(`Formatted Sunrise Time: ${this.formatTime(sunriseTime)}`);
    
        console.log(`Dhuhr Time Calculation:`);
        const dhuhrTime = this.calculateTime(0, declination, equationOfTime, false);
        console.log(`Dhuhr Time (Decimal Hours): ${dhuhrTime}`);
        console.log(`Formatted Dhuhr Time: ${this.formatTime(dhuhrTime)}`);
    
        console.log(`Asr Time Calculation:`);
        const asrTime = this.calculateTime(Math.atan(1 + Math.tan(this.deg2rad(Math.abs(this.latitude - declination)))), declination, equationOfTime, false);
        console.log(`Asr Time (Decimal Hours): ${asrTime}`);
        console.log(`Formatted Asr Time: ${this.formatTime(asrTime)}`);
    
        console.log(`Maghrib Time Calculation:`);
        const maghribTime = this.calculateTime(-0.833, declination, equationOfTime, false);
        console.log(`Maghrib Time (Decimal Hours): ${maghribTime}`);
        console.log(`Formatted Maghrib Time: ${this.formatTime(maghribTime)}`);
    
        console.log(`Isha Time Calculation:`);
        const ishaTime = this.calculateTime(18, declination, equationOfTime, false);
        console.log(`Isha Time (Decimal Hours): ${ishaTime}`);
        console.log(`Formatted Isha Time: ${this.formatTime(ishaTime)}`);
    
        // Return the prayer times in formatted strings
        return {
            Fajr: this.formatTime(fajrTime),
            Sunrise: this.formatTime(sunriseTime),
            Dhuhr: this.formatTime(dhuhrTime),
            Asr: this.formatTime(asrTime),
            Maghrib: this.formatTime(maghribTime),
            Isha: this.formatTime(ishaTime),
        };
    }
    
    
    private formatTime(decimalTime: number): string {
        // Convert decimal time to total minutes
        const totalMinutes = Math.round(decimalTime * 60);
        
        // Calculate hours and minutes
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
    
        // Ensure hours and minutes are positive
        if (hours < 0) {
            return `Invalid Time`;
        }
        
        // Format hours and minutes with leading zeros if necessary
        return `${this.pad(hours)}:${this.pad(minutes)}`;
    }
    
    
    
    private pad(number: number): string {
        return number < 10 ? `0${number}` : `${number}`;
    }
    
    
    
    
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

async function initializePrayerTimes() {
    const latitude = 36.8; // Corrected value
    const longitude = 10.2; // Corrected value
    const timezone = 1; // CET (UTC +1)

    const salatCalculator = new SalatCalculator(latitude, longitude, timezone);
    const prayerTimes = salatCalculator.getPrayerTimes(new Date());
    updatePrayerTimesInHTML(prayerTimes)
    console.log('Calculated prayer times:', prayerTimes);
}

initializePrayerTimes();

console.log('Content script loaded');

    
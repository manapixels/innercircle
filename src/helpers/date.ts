import moment from 'moment-timezone';

export function formatDateRange(start_date: string | Date, end_date: string | Date): string {
    // Convert string inputs to Date objects if necessary
    const startDate = typeof start_date === 'string' ? new Date(start_date) : start_date;
    const endDate = typeof end_date === 'string' ? new Date(end_date) : end_date;
    const currentYear = new Date().getFullYear();

    // Function to format date based on whether it's the current year or not
    const formatDate = (date: Date) => {
        const isCurrentYear = date.getFullYear() === currentYear;
        return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' })}${isCurrentYear ? '' : ' ' + date.getFullYear()}`;
    };

    // Check if both dates are the same day
    if (startDate.toDateString() === endDate.toDateString()) {
        // Return the formatted date for a single day
        return formatDate(startDate);
    } else {
        // Check if the month and year are the same for both dates
        if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
            // Return the formatted date range within the same month and year
            return `${startDate.getDate()} – ${formatDate(endDate)}`;
        } else {
            // Return the full date range across different months or years
            return `${formatDate(startDate)} – ${formatDate(endDate)}`;
        }
    }
}

export function calculateAge(birthYear: number | string | undefined | null, birthMonth: number | string | undefined | null): number | undefined {
    if (birthYear === undefined || birthYear === null || birthMonth === undefined || birthMonth === null) {
        return undefined;
    }
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-based
    // Convert string inputs to numbers if necessary
    const numericBirthYear = typeof birthYear === 'string' ? parseInt(birthYear, 10) : birthYear;
    const numericBirthMonth = typeof birthMonth === 'string' ? parseInt(birthMonth, 10) : birthMonth;
    if (isNaN(numericBirthYear) || isNaN(numericBirthMonth)) {
        return undefined;
    }
    let age = currentYear - numericBirthYear;
    if (numericBirthMonth > currentMonth) {
        age--;
    }
    return age;
}

export function hasDatePassed(inputDate: string | Date | null): boolean {
    if (inputDate === null) {
        return false;
    }
    const currentDate = new Date();
    const dateToCheck = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    return dateToCheck < currentDate;
}

export const getTimeZonesWithOffset = () => {
    const offsets = moment.tz.names().map((zone) => moment.tz(zone).format('Z')); // Gets the offsets (e.g., "+08:00")
    const uniqueOffsets = [...new Set(offsets)]; // Remove duplicates
    const sortedOffsets = uniqueOffsets.sort((a, b) => {
        const offsetA = parseInt(a.replace(':', ''), 10);
        const offsetB = parseInt(b.replace(':', ''), 10);
        return offsetA - offsetB;
    });
    return sortedOffsets.map(offset => `GMT${offset}`); // Sort logically from GMT-12:00 to GMT+12:00 and format
};

export const getGuessedUserTimeZone = () => {
    const guessedZone = moment.tz.guess();
    const offset = moment.tz(guessedZone).format('Z');
    return `GMT${offset}`;
};

export function timeUntil(inputDate: string | Date): string {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for accurate day comparison
    const targetDate = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;
    targetDate.setHours(0, 0, 0, 0); // Reset time to 00:00:00 for accurate day comparison

    const differenceInTime = targetDate.getTime() - currentDate.getTime();
    if (differenceInTime < 0) {
        return ""; // Input date is over
    }

    const differenceInDays = differenceInTime / (1000 * 3600 * 24);
    if (differenceInDays < 1) {
        const differenceInHours = Math.ceil(differenceInTime / (1000 * 3600));
        return `${differenceInHours} hours`; // Less than 24 hours
    }

    return `${Math.ceil(differenceInDays)} days`; // More than 24 hours
}

export function timeBeforeEvent(inputDate: string | Date | null): string | null {
    if (!inputDate) {
        return null;
    }

    const currentDate = new Date();
    const eventDate = typeof inputDate === 'string' ? new Date(inputDate) : inputDate;

    if (eventDate < currentDate) {
        return null; // Event date has passed
    }

    const differenceInMilliseconds = eventDate.getTime() - currentDate.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 3600 * 24);

    if (differenceInDays < 1) {
        return `${Math.ceil(differenceInMilliseconds / (1000 * 3600))} hours`;
    } else if (differenceInDays < 7) {
        return `${Math.ceil(differenceInDays)} days`;
    } else if (differenceInDays < 30) {
        return `${Math.ceil(differenceInDays / 7)} weeks`;
    } else if (differenceInDays < 365) {
        return `${Math.ceil(differenceInDays / 30)} months`;
    } else {
        return `${Math.ceil(differenceInDays / 365)} years`;
    }
}

import dayjs from 'dayjs';

export const getDatesExcludingWeekends = (num: number) => {
    const dates = [];
    let currentDate = dayjs();
    while (dates.length < num) {
        if (currentDate.day() !== 0 && currentDate.day() !== 6) {
            dates.push(currentDate.format('YYYY-MM-DD'));
        }
        currentDate = currentDate.subtract(1, 'day');
    }
    return dates;
};

export const getDateFormatted = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
